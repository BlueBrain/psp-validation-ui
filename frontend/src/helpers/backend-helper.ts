
import axios, { AxiosResponse } from 'axios';
import template from 'lodash/template';
import {
  submitJob,
  setAxiosToken,
  getValidationJobUrls,
  getJobProperties,
  urlToComputerAndId,
} from '@/helpers/unicore';
import { PspJobExtraParams } from '@/interfaces/backend';
import defaultJobConfig, { validationScript } from '@/helpers/job-config';
import { DataToUpload, JobProperties } from '@/interfaces/unicore';
import { CircuitInterface } from '@/interfaces/general-panel';
import { getPrePostNames } from '@/helpers/yaml-helper';
import { tags } from '@/constants/hpc-systems';
import { jobsEndpoint, circuitEndpoint } from '@/constants/backend';

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

function saveInDatabase(unicoreJobId: string, inputs: Array<DataToUpload>, userId: string): Promise<AxiosResponse> {
  return axiosInstance.post(jobsEndpoint, {
    id: unicoreJobId,
    files: inputs,
    user: userId,
  });
}

function getValidationScript(circuitPath: string, extraParams: PspJobExtraParams, yamlFileNames: Array<string>): string {
  const runScriptTemplate = validationScript.join('\n');
  const compiled = template(runScriptTemplate);
  const runScript = compiled({
    blueConfigPath: circuitPath,
    pairs: extraParams.generalParams.pairs,
    trials: extraParams.generalParams.repetitions,
    yamlFiles: yamlFileNames.join(' '),
  });
  return runScript;
}

async function submitPspJob(yamlFiles: Array<string>, circuitPath: string, extraParams: PspJobExtraParams): Promise<JobProperties> {
  const runConfig = defaultJobConfig;
  if (runConfig.tags) {
    runConfig.tags.push(tags.VALIDATION);
    runConfig.tags.push(circuitPath);
  }

  const inputs: Array<DataToUpload> = [];
  const yamlNameList: Array<string> = [];

  yamlFiles.forEach((yamlStr: string) => {
    const yamlObj = convertYamlToInputObj(yamlStr);
    yamlNameList.push(yamlObj.To);
    inputs.push(yamlObj);
  });

  inputs.push({
    Data: getValidationScript(circuitPath, extraParams, yamlNameList),
    To: 'input.sh',
  });

  const jobInfo = await submitJob(runConfig, inputs);
  try {
    await saveInDatabase(jobInfo.id, inputs, extraParams.userId);
  } catch (e) {
    throw new Error(`Error saving in the database: ${e}`);
  }
  return jobInfo;
}

function setToken(token: string) {
  setAxiosToken(token);
}

function getFilesFromBackend(unicoreJobId: string) {
  return axiosInstance.get(jobsEndpoint, { params: { id: unicoreJobId } })
    .then((r: AxiosResponse) => r.data);
}

async function getValidationsWithFiles(circuitPath: string) {
  const jobUrls = await getValidationJobUrls(circuitPath);

  const promises = jobUrls.map(async (url: string) => {
    const { id } = urlToComputerAndId(url);
    if (!id) throw new Error(`no job id was found for ${url}`);

    const jobInfo = await getJobProperties(url);
    if (!jobInfo) throw new Error(`no job info was found for ${id}`);

    const files = await getFilesFromBackend(id);
    if (!files.length) throw new Error(`no files found in database for ${id}`);

    return {
      id,
      jobInfo,
      files,
    };
  });

  return Promise.all(promises);
}

async function getCircuitList(userId: string): Promise<Array<CircuitInterface>> {
  const circuitList = await axiosInstance.get(circuitEndpoint, { params: { user: userId } })
    .then((r: AxiosResponse) => r.data);
  return circuitList;
}

function saveCircuitList(userId: string, circuitList: Array<CircuitInterface>) {
  return axiosInstance.post(circuitEndpoint, {
    user: userId,
    circuits: circuitList,
  });
}

export default {};

export {
  submitPspJob,
  getValidationsWithFiles,
  setToken,
  getCircuitList,
  saveCircuitList,
};
