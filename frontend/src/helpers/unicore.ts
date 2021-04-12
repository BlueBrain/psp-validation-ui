
import axios, { AxiosResponse, AxiosPromise, AxiosError } from 'axios';
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
  UnicoreJobFiles,
  FileObjInterface,
} from '@/interfaces/unicore';
import {
  saveEndedJob,
  getEndedJob,
  saveImageByUrl,
  getStoredImageByUrl,
} from '@/helpers/db';
import { jobStatus, jobExitCode } from '@/constants/backend';

/* eslint-disable no-underscore-dangle */

const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

function init() {
  /* eslint-disable-next-line */
  axiosInstance.interceptors.request.use((config: any) => {
    // Do something before request is sent
    const newConfig = config;

    if (!newConfig || !newConfig.url) return {};

    if (newConfig.responseType === 'blob') {
      // is a file, download fetch data
      newConfig.headers.Accept = 'application/octet-stream';
    }

    return newConfig;
  }, (error: Error) => error);
}

init();

function setAxiosToken(token: string) {
  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
}

function getComputerUrl(): string {
  return hpc.PIZ_DAINT.url;
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
    .catch((e: Error) => { throw new Error(`getInfoByUrl ${e.message}`); });
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
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    data,
  });
}

async function getValidationJobUrls(circuitPath: string): Promise<Array<string>> {
  const unicoreURL = getComputerUrl();
  // get sims only for this specific circuit
  const queryStr = `tags=${tags.VALIDATION},${circuitPath}`;
  return axiosInstance(`${unicoreURL}/jobs?${queryStr}`)
    .then((r: AxiosResponse) => get(r, 'data.jobs', []))
    .catch((e: AxiosError) => {
      throw new Error(`getting getValidationJobUrls ${e.message}`);
    });
}

async function getJobProperties(jobURL: string): Promise<JobProperties | null> {
  const result = await getEndedJob(jobURL);
  if (result) return result; // found in localStorage

  let jobInfo = null; // fetch from network
  try {
    jobInfo = await getInfoByUrl(jobURL);
  } catch (e) {
    throw new Error(`getJobProperties ${e.message}`);
  }
  if (!jobInfo) return null;
  const { id } = urlToComputerAndId(jobInfo._links.self.href);
  if (!id) return null;
  jobInfo.id = id;
  saveEndedJob(jobInfo);
  return jobInfo;
}

async function getFilesList(jobURL: string, fullObject: boolean = false): Promise<Array<string> | FileObjInterface> {
  const response: AxiosResponse = await axiosInstance.get(jobURL)
    .catch((e: Error) => { throw new Error(`getFilesByUrl ${e.message}`); });
  const filesObj: UnicoreJobFiles = response.data;

  if (filesObj.content['/*/']) delete filesObj.content['/*/'];

  if (fullObject) return filesObj.content;
  return Object.keys(filesObj.content);
}

async function generateUnicoreConfig(configParams: GeneralJobDefinition): Promise<UnicoreJobDefinition> {
  // generate jobSpecs and remove the nulls
  const unicoreConfig: UnicoreJobDefinition = cleanDeep({
    Name: configParams.title || 'unnamed job',
    Executable: configParams.executable,
    Arguments: [],
    haveClientStageIn: 'true',
    Resources: {
      Nodes: configParams.nodes,
      CPUsPerNode: configParams.cpusPerNode,
      Memory: configParams.memory,
      Runtime: configParams.runtime,
      NodeConstraints: configParams.nodeType,
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

function getJobPhysicalLocation(log: Array<string>): string {
  const regexp = /TSI_USPACE_DIR (.*)/;
  const matchesStr = log.find((logLine: string) => logLine.match(regexp));
  if (!matchesStr) return '-';
  const matched = matchesStr.match(regexp);
  const location = matched && matched.length ? matched[1] : '-';
  return location;
}

function getJobExpandedById(jobId: string): Promise<JobProperties | null> {
  const computer = getComputerUrl();
  const url = `${computer}/jobs/${jobId}`;
  return getJobProperties(url);
}

function getFinalStatus(jobInfo: JobProperties) {
  return jobStatus.SUCCESSFUL === jobInfo.status
    ? jobExitCode[jobInfo.exitCode]
    : jobInfo.status;
}

async function getImage(imageURL: string): Promise<string> {
  const storedImg = await getStoredImageByUrl(imageURL);
  if (storedImg) return storedImg;

  const response = await axiosInstance({
    url: imageURL,
    method: 'get',
    responseType: 'blob',
  });
  // convert blob to Image
  const imgPromise: Promise<string> = new Promise((resolve: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      saveImageByUrl(imageURL, reader.result as string);
      resolve(reader.result);
    }, false);
    reader.readAsDataURL(response.data);
  });
  const imgData = await imgPromise;
  return imgData;
}
function deleteJob(url: string): AxiosPromise {
  return axiosInstance({
    url,
    method: 'delete',
  });
}

function getFile(jobURL: string): Promise<Blob> {
  return axiosInstance.get(jobURL, {
    responseType: 'blob',
  })
    .then((r: AxiosResponse) => (r.data))
    .catch((e: Error) => { throw new Error(`getFile ${e.message}`); });
}

export {
  submitJob,
  getFilesList,
  getComputerUrl,
  getValidationJobUrls,
  getJobProperties,
  urlToComputerAndId,
  setAxiosToken,
  getJobPhysicalLocation,
  getJobExpandedById,
  getFinalStatus,
  getImage,
  deleteJob,
  getFile,
};

export default {};
