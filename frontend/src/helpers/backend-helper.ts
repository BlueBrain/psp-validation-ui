
/* eslint-disable no-underscore-dangle */
import axios, { AxiosResponse } from 'axios';
import template from 'lodash/template';
import {
  submitJob,
  setAxiosToken,
  getValidationJobUrls,
  getJobProperties,
  urlToComputerAndId,
  getJobPhysicalLocation,
  getJobExpandedById,
  getFinalStatus,
  getFilesList,
  getImage,
  deleteJob,
} from '@/helpers/unicore';
import { PspJobExtraParams, PlotsPathsObj } from '@/interfaces/backend';
import defaultJobConfig, { validationScript } from '@/helpers/job-config';
import { DataToUpload, JobProperties, FileObjInterface } from '@/interfaces/unicore';
import { CircuitInterface } from '@/interfaces/general-panel';
import { getPrePostNames, transformYamlToObj } from '@/helpers/yaml-helper';
import { tags } from '@/constants/hpc-systems';
import { jobsEndpoint, circuitEndpoint } from '@/constants/backend';
import { ValidationsExpanded } from '@/interfaces/results';
import { RowToYamlInterface } from '@/interfaces/table';


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
    saveTraces: extraParams.generalParams.saveTraces ? '--dump-traces' : '',
    saveAmplitudes: extraParams.generalParams.saveAmplitudes ? '--dump-amplitudes' : '',
  });
  return runScript;
}

async function submitPspJob(yamlFiles: Array<string>, circuitPath: string, extraParams: PspJobExtraParams): Promise<JobProperties> {
  const runConfig = defaultJobConfig;
  if (runConfig.tags) {
    runConfig.tags.push(tags.VALIDATION);
    runConfig.tags.push(circuitPath);
  }
  runConfig.title = extraParams.title;

  let inputs: Array<DataToUpload> = [];
  const yamlNameList: Array<string> = [];

  const yamlsToInput = yamlFiles.map((yamlStr: string) => {
    const yamlObj = convertYamlToInputObj(yamlStr);
    yamlNameList.push(yamlObj.To);
    return yamlObj;
  });

  inputs.push({
    Data: getValidationScript(circuitPath, extraParams, yamlNameList),
    To: 'input.sh',
  });

  inputs = inputs.concat(yamlsToInput);

  const jobInfo = await submitJob(runConfig, inputs);
  try {
    await saveInDatabase(jobInfo.id, yamlsToInput, extraParams.userId);
  } catch (e) {
    throw new Error(`Error saving in the database: ${e.message}`);
  }
  return jobInfo;
}

function setToken(token: string) {
  setAxiosToken(token);
}

async function getFilesFromBackend(unicoreJobId: string): Promise<Array<RowToYamlInterface>> {
  const files = await axiosInstance.get(jobsEndpoint, { params: { id: unicoreJobId } })
    .then((r: AxiosResponse) => r.data);
  const expandedInfoObj: Array<RowToYamlInterface> = files
    .map((yaml: DataToUpload): RowToYamlInterface => {
      const pathwayObj = transformYamlToObj(yaml.Data);
      return pathwayObj;
    });
  return expandedInfoObj;
}

async function getValidationsExpanded(circuitPath: string): Promise<Array<ValidationsExpanded>> {
  const jobUrls = await getValidationJobUrls(circuitPath);

  const promises = jobUrls.map(async (url: string) => {
    const { id } = urlToComputerAndId(url);
    if (!id) throw new Error(`no job id was found for ${url}`);

    const jobInfo = await getJobProperties(url);
    if (!jobInfo) throw new Error(`no job info was found for ${id}`);

    const physicalLocation = getJobPhysicalLocation(jobInfo.log);

    return {
      id,
      jobInfo,
      physicalLocation,
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

async function getValidationPlots(jobInfo: JobProperties): Promise<Array<PlotsPathsObj>> {
  const url = `${jobInfo._links.workingDirectory.href}/files/`;
  const returnRawObject = true;
  const filesObj = (await getFilesList(url, returnRawObject) as Array<FileObjInterface>);
  const folders = Object.keys(filesObj).filter((file: string) => file.endsWith('/'));

  const plotObjectsPromises = folders.map(async (pathwayName: string) => {
    const folderURL = url + pathwayName;
    const plotPathArray = await getFilesList(folderURL) as Array<string>;
    // fetch images for each path
    const plots = plotPathArray.map((imgPath: string) => getImage(url + imgPath));
    // TODO remove this
    const plotsDataResolved = await Promise.all(plots);

    const pairsArray = plotPathArray.map((pairPath: string, index: number) => {
      const pairNameMatch = pairPath.match(/\/(\w+-\w+)\.\w+$/);
      const name = (!pairNameMatch || pairNameMatch.length < 2)
        ? 'Unknown Pair'
        : pairNameMatch[1];
      return {
        plotData: plotsDataResolved[index],
        name,
      };
    });

    const plotPathObj: PlotsPathsObj = {
      pathwayName: pathwayName.replace(/\//g, ''),
      plotPathArray,
      pairsArray,
    };
    return plotPathObj;
  });

  const plotObjArray = await Promise.all(plotObjectsPromises);
  return plotObjArray;
}

export default {};

export {
  submitPspJob,
  getValidationsExpanded,
  setToken,
  getCircuitList,
  saveCircuitList,
  getFilesFromBackend,
  getFinalStatus,
  getJobPhysicalLocation,
  getJobExpandedById,
  getValidationPlots,
  deleteJob,
};
