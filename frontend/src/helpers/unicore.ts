
import axios, { AxiosResponse } from 'axios';
import find from 'lodash/find';
import get from 'lodash/get';
import cleanDeep from 'clean-deep';
import hpc, { tags } from '@/constants/hpc-systems';
import {
  UrlToComputerAndIdInterface,
  UnicoreJobDefinition,
  GeneralJobDefinition,
  JobProperties,
  DataToUpload,
  HPCComputer,
} from '@/interfaces/unicore';

/* eslint-disable no-underscore-dangle */

const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    post: {
      'Content-Type': 'application/json',
    },
    put: {
      'Content-Type': 'application/octet-stream',
    },
  },
});

function init() {
  /* eslint-disable-next-line */
  axiosInstance.interceptors.request.use((config: any) => {
    // Do something before request is sent
    const newConfig = config;

    // Download a file
    if (!newConfig || !newConfig.url) return {};

    if (
      newConfig.url.includes('/core/storages/')
      && !newConfig.url.endsWith('/files')
      && !newConfig.url.endsWith('/files/')
      && !newConfig.url.endsWith('uspace')
    ) {
      newConfig.headers.Accept = 'application/octet-stream';
    }

    // avoid sending param when ask for the user projects
    if (newConfig.url.endsWith('/rest/core')) {
      delete newConfig.headers['X-UNICORE-User-Preferences'];
    }

    return newConfig;
  }, (error: Error) => error);
}

init();

function setAxiosToken(token: string) {
  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
}

function getComputerUrl(): string {
  return hpc.BB5.url;
  // return hpc.PIZ_DAINT.url;
}

function actionJob(actionURL: string) {
  // initiate some actions like start, restart, abort
  return axiosInstance({
    url: actionURL,
    method: 'post',
    data: JSON.stringify({}),
  });
}

function getInfoByUrl(transferUrl: string): Promise<JobProperties> {
  return axiosInstance.get(transferUrl)
    .then((r: AxiosResponse) => r.data)
    .catch((e: Error) => { throw new Error(`getInfoByUrl ${e}`); });
}

function urlToComputerAndId(jobURL: string): UrlToComputerAndIdInterface {
  const notFoundResult = { computer: null, id: null };
  if (!jobURL) return notFoundResult;
  const result = find(hpc, (elem: HPCComputer) => jobURL.startsWith(elem.url));
  if (!result) return notFoundResult;

  const m = jobURL.match(new RegExp('/rest/core/jobs/(.*)'));
  if (!m || !m.length) return notFoundResult;
  return { computer: result.id, id: m[1] };
}

function createJob(url: string, jobDefinition: UnicoreJobDefinition): Promise<AxiosResponse> {
  return axiosInstance({
    url: `${url}/jobs`,
    method: 'post',
    data: JSON.stringify(jobDefinition),
  });
}

function uploadData(dataToUpload: DataToUpload, uploadURL: string): Promise<AxiosResponse> {
  const data = dataToUpload.Data;
  const target = dataToUpload.To;
  return axiosInstance({
    url: `${uploadURL}/${target}`,
    method: 'put',
    data,
  });
}

async function getValidationJobUrls(circuitPath: string): Promise<Array<string>> {
  const unicoreURL = getComputerUrl();
  // get sims only for this specific circuit
  const queryStr = `tags=${tags.VALIDATION},${circuitPath}`;
  return axiosInstance(`${unicoreURL}/jobs?${queryStr}`)
    .then((r: AxiosResponse) => get(r, 'data.jobs', []))
    .catch((e: Error) => { throw new Error(`getting getValidationJobUrls ${e}`); });
}

async function getJobProperties(jobURL: string): Promise<JobProperties | null> {
  // TODO rework here the nulls
  // let result = await db.getJobByUrl(jobURL);
  const result = null;
  let jobInfo = null;
  if (!result) {
    try {
      jobInfo = await getInfoByUrl(jobURL);
    } catch (e) {
      throw new Error(`getJobProperties ${e}`);
    }
    if (!jobInfo) return null;
    const { id } = urlToComputerAndId(jobInfo._links.self.href);
    if (!id) return null;
    jobInfo.id = id;
    // db.add(jobInfo);
  }
  return jobInfo;
}

async function getFilesList(jobURL: string): Promise<Array<string>> {
  try {
    const response = await getInfoByUrl(jobURL);
    const filesObj = get(response, 'data.content', {});
    return Object.keys(filesObj);
  } catch (e) {
    return [];
  }
}

async function generateUnicoreConfig(configParams: GeneralJobDefinition): Promise<UnicoreJobDefinition> {
  function getNodes() {
    // avoid setting nodes for test job submission
    if (configParams.nodes === 0) return null;
    return configParams.runtime < 200 ? null : configParams.nodes;
  }

  const nodes = getNodes();
  // generate jobSpecs and remove the nulls
  const unicoreConfig: UnicoreJobDefinition = cleanDeep({
    Name: configParams.title || 'unnamed job',
    Executable: configParams.executable || '/bin/bash input.sh',
    Arguments: [],
    haveClientStageIn: 'true',
    Resources: {
      Nodes: nodes,
      CPUsPerNode: 32,
      Runtime: configParams.runtime,
      NodeConstraints: 'uc3',
      Queue: 'prod',
      Project: 'proj42',
    },
    Tags: configParams.tags,
    Imports: configParams.imports,
  });
  return unicoreConfig;
}

async function submitJob(
  runConfig: GeneralJobDefinition,
  inputs: Array<DataToUpload>,
  startLater: boolean = false,
): Promise<JobProperties> {
  const newRunConfig = runConfig;
  const unicoreURL = getComputerUrl();

  try {
    const launchParams = await generateUnicoreConfig(newRunConfig);
    const job = await createJob(unicoreURL, launchParams);

    const jobURL = job.headers.location;
    if (!jobURL) throw new Error('Location not present on response headers');

    const jobProperties = await getJobProperties(jobURL);
    if (!jobProperties) throw new Error('getJobProperties');

    const workingDirectory = jobProperties._links.workingDirectory.href;
    const actionStartURL = jobProperties._links['action:start'].href;
    // const { id } = urlToComputerAndId(jobProperties._links.self.href);

    // upload all the inputs
    await Promise.all(inputs.map((input: DataToUpload) => uploadData(input, `${workingDirectory}/files`)));

    // avoid starting the job directly
    if (startLater) {
      return jobProperties;
    }

    await actionJob(actionStartURL);
    return jobProperties;
  } catch (err) {
    throw new Error(`Submit job ${err}`);
  }
}

export {
  submitJob,
  getFilesList,
  getComputerUrl,
  getValidationJobUrls,
  getJobProperties,
  urlToComputerAndId,
  setAxiosToken,
};

export default {};
