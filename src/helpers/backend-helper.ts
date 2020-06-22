
import axios, { AxiosResponse } from 'axios';
import {
  submitJob,
  setAxiosToken,
  getValidationJobUrls,
  getJobProperties,
  urlToComputerAndId,
} from '@/helpers/unicore';
import defaultJobConfig from '@/helpers/job-config';
import { DataToUpload, JobProperties } from '@/interfaces/unicore';
import { getPrePostNames } from '@/helpers/yaml-helper';
import { tags } from '@/constants/hpc-systems';
import { backendEndpoint } from '@/constants/backend';

const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

function convertYamlToInputObj(yamlFile: string) {
  const preAndPost = getPrePostNames(yamlFile);
  const fileName = `${preAndPost.pre}-${preAndPost.post}.yaml`;
  const fileObj: DataToUpload = {
    Data: yamlFile,
    To: fileName,
  };
  return fileObj;
}

function saveInDatabase(unicoreJobId: string, inputs: Array<DataToUpload>): Promise<AxiosResponse> {
  return axiosInstance.post(backendEndpoint, {
    id: unicoreJobId,
    files: inputs,
  });
}

async function submitPspJob(yamlFiles: Array<string>, circuitPath: string): Promise<JobProperties> {
  const runConfig = defaultJobConfig;
  if (runConfig.tags) {
    runConfig.tags.push(tags.VALIDATION);
    runConfig.tags.push(circuitPath);
  }
  const inputs: DataToUpload[] = [{
    Data: 'echo "Hello World"',
    To: 'input.sh',
  }];

  yamlFiles.forEach((yamlStr: string) => {
    const yamlObj = convertYamlToInputObj(yamlStr);
    inputs.push(yamlObj);
  });

  const jobInfo = await submitJob(runConfig, inputs);
  try {
    await saveInDatabase(jobInfo.id, inputs);
  } catch (e) {
    throw new Error(`Error saving in the database: ${e}`);
  }
  return jobInfo;
}

function setToken(token: string) {
  setAxiosToken(token);
}

function getFilesFromBackend(unicoreJobId: string) {
  return axiosInstance.get(backendEndpoint, {
    params: {
      id: unicoreJobId,
    },
  }).then((r: AxiosResponse) => r.data);
}

async function getValidationsWithFiles(circuitPath: string) {
  const jobUrls = await getValidationJobUrls(circuitPath);

  const promises = jobUrls.map(async (url: string) => {
    const { id } = urlToComputerAndId(url);
    if (!id) throw new Error(`no job id was found for ${url}`);

    const jobInfo = await getJobProperties(url);
    if (!jobInfo) throw new Error(`no job info was found for ${id}`);

    const files = await getFilesFromBackend(id);
    return {
      id,
      jobInfo,
      files,
    };
  });

  return Promise.all(promises);
}

export default {};

export {
  submitPspJob,
  getValidationsWithFiles,
  setToken,
};
