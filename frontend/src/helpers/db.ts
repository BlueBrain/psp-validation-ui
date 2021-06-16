
import localForage from 'localforage';
import { GeneralPanelParamsInterface } from '@/interfaces/general-panel';
import { TableRowInterface } from '@/interfaces/table';
import { JobProperties } from '@/interfaces/unicore';
import { jobStatus } from '@/constants/backend';

const constants = {
  CIRCUIT_LIST: 'circuitList',
  CIRCUIT_SELECTED: 'circuitSelected',
  GENERAL_PANEL_PARAMS: 'generalPanelParams',
  ROWS_DATA: 'rowsData',
  CIRCUIT_PATH: 'circuitPath',
  PROJECT_SELECTED: 'projectSelected',
  VMM_TOKEN: 'auth',
};

function generatePairStr(str1: string, str2: string) {
  return `${str1} - ${str2}`;
}

function saveGeneralParams(generalParams: GeneralPanelParamsInterface, circuitPath: string) {
  localForage.setItem(generatePairStr(constants.GENERAL_PANEL_PARAMS, circuitPath), generalParams);
}
function saveCircuitPathSync(userId: string, path: string) {
  localStorage.setItem(generatePairStr(userId, constants.CIRCUIT_PATH), path);
}
function saveTableRowData(rowsData: Array<TableRowInterface>, circuitPath: string) {
  localForage.setItem(generatePairStr(constants.ROWS_DATA, circuitPath), rowsData);
}


function getStoredGeneralPanelParams(circuitPath: string): Promise<GeneralPanelParamsInterface | null> {
  return localForage.getItem(generatePairStr(constants.GENERAL_PANEL_PARAMS, circuitPath));
}
function getStoredCircuitPathSync(userId: string): string {
  return localStorage.getItem(generatePairStr(userId, constants.CIRCUIT_PATH)) || '/';
}
function getStoredTableRowData(circuitPath: string): Promise<Array<TableRowInterface> | null> {
  return localForage.getItem(generatePairStr(constants.ROWS_DATA, circuitPath));
}

function saveEndedJob(jobInfo: JobProperties) {
  if ([jobStatus.FAILED, jobStatus.SUCCESSFUL].includes(jobInfo.status)) {
    const url = jobInfo._links.self.href;
    localForage.setItem(url, jobInfo);
  }
}
async function getEndedJob(jobUrl: string): Promise<JobProperties | null> {
  return localForage.getItem(jobUrl);
}

function setProjectSelected(newProject: string): void {
  localStorage.setItem(constants.PROJECT_SELECTED, newProject);
}

function saveImageByUrl(imageUrl: string, data: string) {
  localForage.setItem(imageUrl, data);
}
function getStoredImageByUrl(imageUrl: string): Promise<string | null> {
  return localForage.getItem(imageUrl);
}

export function setUserTokenFromVMM(userHash: string) {
  localStorage.setItem(constants.VMM_TOKEN, userHash);
}

export function getUserTokenFromVMM() {
  return localStorage.getItem(constants.VMM_TOKEN) || 'unknown_user';
}

export default {};

export {
  saveGeneralParams,
  getStoredGeneralPanelParams,
  getStoredCircuitPathSync,
  saveCircuitPathSync,
  saveTableRowData,
  getStoredTableRowData,
  saveEndedJob,
  getEndedJob,
  setProjectSelected,
  saveImageByUrl,
  getStoredImageByUrl,
  constants,
};
