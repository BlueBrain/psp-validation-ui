
import localForage from 'localforage';
import { GeneralPanelParamsInterface } from '@/interfaces/general-panel';
import { TableRowInterface } from '@/interfaces/table';

const constants = {
  CIRCUIT_LIST: 'circuitList',
  CIRCUIT_SELECTED: 'circuitSelected',
  GENERAL_PANEL_PARAMS: 'generalPanelParams',
  ROWS_DATA: 'rowsData',
  CIRCUIT_PATH: 'circuitPath',
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


function getStoredGeneralPanelParams(circuitPath: string): Promise<GeneralPanelParamsInterface> {
  return localForage.getItem(generatePairStr(constants.GENERAL_PANEL_PARAMS, circuitPath));
}
function getStoredCircuitPathSync(userId: string): string | null {
  return localStorage.getItem(generatePairStr(userId, constants.CIRCUIT_PATH));
}
function getStoredTableRowData(circuitPath: string): Promise<Array<TableRowInterface>> {
  return localForage.getItem(generatePairStr(constants.ROWS_DATA, circuitPath));
}


export default {};

export {
  saveGeneralParams,
  getStoredGeneralPanelParams,
  getStoredCircuitPathSync,
  saveCircuitPathSync,
  saveTableRowData,
  getStoredTableRowData,
};
