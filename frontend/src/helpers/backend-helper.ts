
/* eslint-disable no-underscore-dangle */
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
import defaultJobConfig from '@/helpers/job-config';
import { DataToUpload, JobProperties, FileObjInterface } from '@/interfaces/unicore';
import { getPrePostNames, transformYamlToObj } from '@/helpers/yaml-helper';
import {
  tags,
  RUN_SCRIPT_NAME,
  PATHWAY_LIST,
  RUN_CONFIG_FILE,
  RUN_SCRIPT_PLACEHOLDER,
} from '@/constants/hpc-systems';
import { ValidationsExpanded } from '@/interfaces/results';
import { RowToYamlInterface } from '@/interfaces/table';
import {
  getUserTokenFromVMM,
  setUserTokenFromVMM,
  constants as dbConstants,
} from '@/helpers/db';


function convertYamlToInputObj(yamlFile: string) {
  const preAndPost = getPrePostNames(yamlFile);
  const fileName = `${preAndPost.pre}-${preAndPost.post}.yaml`;
  const fileObj: DataToUpload = {
    Data: yamlFile,
    To: fileName,
  };
  return fileObj;
}

function getValidationConfigFile(extraParams: PspJobExtraParams, yamlFileNames: Array<string>): string {
  const validationConfigFile = {
    pairs: extraParams.generalParams.pairs,
    trials: extraParams.generalParams.repetitions,
    yamlFiles: yamlFileNames.join(' '),
    saveTraces: extraParams.generalParams.saveTraces ? '--dump-traces' : '',
    saveAmplitudes: extraParams.generalParams.saveAmplitudes ? '--dump-amplitudes' : '',
  };
  return JSON.stringify(validationConfigFile);
}

async function submitPspJob(yamlFiles: Array<string>, circuitPath: string, extraParams: PspJobExtraParams): Promise<JobProperties> {
  const runConfig = defaultJobConfig;
  if (runConfig.tags) {
    runConfig.tags.push(tags.VALIDATION);
    runConfig.tags.push(circuitPath);
  }
  runConfig.title = extraParams.name;

  let inputs: Array<DataToUpload> = [];
  const yamlNameList: Array<string> = [];

  const yamlsToInput = yamlFiles.map((yamlStr: string) => {
    const yamlObj = convertYamlToInputObj(yamlStr);
    yamlNameList.push(yamlObj.To);
    return yamlObj;
  });

  inputs.push({
    Data: getValidationConfigFile(extraParams, yamlNameList),
    To: RUN_CONFIG_FILE,
  });

  inputs.push({
    Data: RUN_SCRIPT_PLACEHOLDER,
    To: RUN_SCRIPT_NAME,
  });

  // to get the content faster later all in one file
  inputs.push({
    Data: JSON.stringify(yamlsToInput),
    To: PATHWAY_LIST,
  });

  inputs = inputs.concat(yamlsToInput);

  const jobInfo = await submitJob(runConfig, inputs);
  return jobInfo;
}

function setToken(token: string) {
  // set to the instance for Unicore
  setAxiosToken(token);
}

async function getFilesFromBackend(unicoreJobId: string): Promise<Array<RowToYamlInterface>> {
  const jobInfo = await getJobExpandedById(unicoreJobId);
  if (!jobInfo) throw new Error('error fetching jobInfo for files tree');

  const url = `${jobInfo._links.workingDirectory.href}/files/${PATHWAY_LIST}`;
  const response = await getFile(url);
  if (!response) throw new Error('No File Found');

  const responseText = await response.text();
  const pathwaysFile = JSON.parse(responseText);

  const expandedInfoObj: Array<RowToYamlInterface> = pathwaysFile
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

async function getValidationPlots(jobInfo: JobProperties): Promise<Array<PlotsPathsObj>> {
  const url = `${jobInfo._links.workingDirectory.href}/files`;
  const returnFullObject = true;
  const filesObj = (await getFilesList(url, returnFullObject) as FileObjInterface);
  const folders = Object.keys(filesObj).filter((file: string) => file.endsWith('/'));

  const plotObjectsPromises = folders.map(async (pathwayName: string) => {
    const folderURL = `${url}/${pathwayName}`;
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

  const url = `${jobInfo._links.workingDirectory.href}/files`;
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

async function hashString(str: string) {
  if (!str) return 'anonymous';
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

export function setupVmmAuth() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const vmmAuth = urlSearchParams.get(dbConstants.VMM_TOKEN);
  const savedAuth = getUserTokenFromVMM();
  if (!vmmAuth) {
    if (!savedAuth) return;
    setToken(savedAuth);
    return;
  }

  if (savedAuth !== vmmAuth) setUserTokenFromVMM(vmmAuth);
  setToken(vmmAuth);
}

export default {};

export {
  submitPspJob,
  getValidationsExpanded,
  setToken,
  getFilesFromBackend,
  getFinalStatus,
  getJobPhysicalLocation,
  getJobExpandedById,
  getValidationPlots,
  deleteJob,
  getValidationResultFiles,
  getBulkFilesById,
  getRepetitionsParam,
  hashString,
};
