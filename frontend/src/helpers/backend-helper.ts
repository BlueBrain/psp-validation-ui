
/* eslint-disable no-underscore-dangle */
import axios, { AxiosResponse } from 'axios';
import template from 'lodash/template';
import difference from 'lodash/difference';
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
  getFile,
} from '@/helpers/unicore';
import {
  PspJobExtraParams,
  PlotsPathsObj,
  FilesTreeInterface,
} from '@/interfaces/backend';
import defaultJobConfig, { validationScript } from '@/helpers/job-config';
import { DataToUpload, JobProperties, FileObjInterface } from '@/interfaces/unicore';
import {
  CircuitInterface,
  CircuitInfoResponse,
  StoredCircuitAndList,
} from '@/interfaces/general-panel';
import { getPrePostNames, transformYamlToObj } from '@/helpers/yaml-helper';
import { tags, RUN_SCRIPT_NAME } from '@/constants/hpc-systems';
import {
  JOBS_ENDPOINT,
  CIRCUIT_ENDPOINT,
  CIRCUIT_INFO_ENDPOINT,
} from '@/constants/backend';
import { ValidationsExpanded } from '@/interfaces/results';
import { RowToYamlInterface } from '@/interfaces/table';
import { getStoredCircuitPathSync } from '@/helpers/db';


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
  return axiosInstance.post(JOBS_ENDPOINT, {
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
    workers: yamlFileNames.length,
  });
  return runScript;
}

async function submitPspJob(yamlFiles: Array<string>, circuitPath: string, extraParams: PspJobExtraParams): Promise<JobProperties> {
  const runConfig = defaultJobConfig;
  if (runConfig.tags) {
    runConfig.tags.push(tags.VALIDATION);
    runConfig.tags.push(circuitPath);
  }
  runConfig.title = extraParams.name;
  runConfig.project = extraParams.project;

  let inputs: Array<DataToUpload> = [];
  const yamlNameList: Array<string> = [];

  const yamlsToInput = yamlFiles.map((yamlStr: string) => {
    const yamlObj = convertYamlToInputObj(yamlStr);
    yamlNameList.push(yamlObj.To);
    return yamlObj;
  });

  inputs.push({
    Data: getValidationScript(circuitPath, extraParams, yamlNameList),
    To: RUN_SCRIPT_NAME,
  });

  inputs = inputs.concat(yamlsToInput);

  // make runtime depends on the config selected
  runConfig.runtime = extraParams.generalParams.pairs
    * (extraParams.generalParams.repetitions)
    * yamlNameList.length
    * 100
    + 3600;

  runConfig.cpus = yamlNameList.length;

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
  const files = await axiosInstance.get(JOBS_ENDPOINT, { params: { id: unicoreJobId } })
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
  const jobUrlsSorted = jobUrls.reverse();

  const promises = jobUrlsSorted.map(async (url: string) => {
    const { id } = urlToComputerAndId(url);
    if (!id) throw new Error(`no job id was found for ${url}`);

    const jobInfo = await getJobProperties(url);
    if (!jobInfo) throw new Error(`no job info was found for ${id}`);

    return {
      id,
      jobInfo,
    };
  });

  return Promise.all(promises);
}

async function getCircuitList(userId: string): Promise<Array<CircuitInterface>> {
  const circuitList = await axiosInstance.get(CIRCUIT_ENDPOINT, { params: { user: userId } })
    .then((r: AxiosResponse) => r.data);
  return circuitList;
}

function saveCircuitList(userId: string, circuitList: Array<CircuitInterface>) {
  return axiosInstance.post(CIRCUIT_ENDPOINT, {
    user: userId,
    circuits: circuitList,
  });
}

async function getValidationPlots(jobInfo: JobProperties): Promise<Array<PlotsPathsObj>> {
  const url = `${jobInfo._links.workingDirectory.href}/files/`;
  const returnFullObject = true;
  const filesObj = (await getFilesList(url, returnFullObject) as FileObjInterface);
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

async function getValidationResultFiles(jobId: string): Promise<Array<FilesTreeInterface>> {
  const jobInfo = await getJobExpandedById(jobId);
  if (!jobInfo) throw new Error('error fetching jobInfo for files tree');

  const url = `${jobInfo._links.workingDirectory.href}/files/`;
  const returnFullObject = true;
  const filesObj = (await getFilesList(url, returnFullObject) as FileObjInterface);

  const files = Object.keys(filesObj);
  const folders = files.filter((fileName: string) => (fileName.endsWith('/')));
  let filesProcessed: Array<string> = [];
  const result: Array<FilesTreeInterface> = folders.map((folderName: any) => {
    const pathwayName = folderName.replace(/\//g, '');
    const regexp = new RegExp(`${pathwayName}..+`);
    const filesToDownload = files
      .sort()
      .filter((fileName: string) => {
        const matched = regexp.test(fileName);
        return matched;
      })
      .map((fileName: string) => {
        filesProcessed.push(fileName);
        return { title: fileName };
      });

    return {
      title: folderName,
      expand: true,
      children: filesToDownload,
    };
  });

  filesProcessed = filesProcessed.concat(folders);
  const otherFiles = difference(files, filesProcessed);

  result.push({
    title: 'Others',
    expand: true,
    children: otherFiles.map((fileName: string) => ({ title: fileName })),
  });

  return [{
    title: 'Select all',
    expand: true,
    children: result,
  }];
}

async function getBulkFilesById(jobId: string, filePathList: Array<string>): Promise<Array<Blob>> {
  const jobInfo = await getJobExpandedById(jobId);
  if (!jobInfo) throw new Error('error fetching jobInfo for files tree');

  const url = `${jobInfo._links.workingDirectory.href}/files/`;
  const promiseArray = filePathList.map(async (filePath: string) => {
    const file = await getFile(url + filePath);
    return file;
  });
  const fileContentList = await Promise.all(promiseArray);
  return fileContentList;
}

async function getRepetitionsParam(workingDirectory: string): Promise<string> {
  const url = `${workingDirectory}/files/${RUN_SCRIPT_NAME}`;
  const file = await getFile(url);
  if (!file) throw new Error('No run script found');

  const regexp = new RegExp('-r (\\d+)');
  const match = (await file.text()).match(regexp);
  if (!match || !match.length) return 'Unknown';
  return match[1];
}

function getCircuitInfo(circuitPath: string): Promise<CircuitInfoResponse> {
  return axiosInstance.get(CIRCUIT_INFO_ENDPOINT, { params: { path: circuitPath } })
    .then((r: AxiosResponse) => {
      const response = r.data;
      if (response.error) throw new Error(response.error);
      return response.results;
    })
    .catch((e: Error) => {
      throw new Error(`Error fetching Circuit Information: ${e.message}`);
    });
}

async function getAsyncStoredCircuitAndList(userId: string, defaultList: Array<CircuitInterface>): Promise<StoredCircuitAndList> {
  const circuitPath = getStoredCircuitPathSync(userId);

  const storedCircuitList: Array<CircuitInterface> = await getCircuitList(userId);
  // if no stored use default and obj defaul[0]
  const circuitObjFound = storedCircuitList.find((circuitObj: CircuitInterface) => (
    circuitObj.path === circuitPath
  ));

  if (circuitObjFound && circuitPath !== circuitObjFound.path) {
    throw new Error('Circuit saved does not match');
  }

  const circuitAndList: StoredCircuitAndList = {
    circuit: circuitObjFound || Object.assign([], defaultList[0]),
    list: storedCircuitList.length ? storedCircuitList : Object.assign([], defaultList),
  };
  return circuitAndList;
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
  getValidationResultFiles,
  getBulkFilesById,
  getRepetitionsParam,
  getCircuitInfo,
  getAsyncStoredCircuitAndList,
};
