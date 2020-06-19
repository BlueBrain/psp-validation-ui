
import localForage from 'localforage';
import { CircuitInterface, GeneralPanelParamsInterface } from '@/interfaces/general-panel';
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

function saveCircuitList(circuitList: Array<CircuitInterface>) {
  localForage.setItem(constants.CIRCUIT_LIST, circuitList);
}
function saveCircuitSelected(circuitSelected: CircuitInterface) {
  localForage.setItem(constants.CIRCUIT_SELECTED, circuitSelected);
}
function saveGeneralParams(generalParams: GeneralPanelParamsInterface, circuitPath: string) {
  localForage.setItem(generatePairStr(constants.GENERAL_PANEL_PARAMS, circuitPath), generalParams);
}
function saveCircuitPathSync(path: string) {
  localStorage.setItem(constants.CIRCUIT_PATH, path);
}

function saveTableRowData(rowsData: Array<TableRowInterface>, circuitPath: string) {
  localForage.setItem(generatePairStr(constants.ROWS_DATA, circuitPath), rowsData);
}


function getStoredGeneralPanelParams(circuitPath: string): Promise<GeneralPanelParamsInterface> {
  return localForage.getItem(generatePairStr(constants.GENERAL_PANEL_PARAMS, circuitPath));
}
function getStoredGeneralPanelCircuitSelected(): Promise<CircuitInterface> {
  return localForage.getItem(constants.CIRCUIT_SELECTED);
}
function getStoredGeneralPanelCircuitList(): Promise<Array<CircuitInterface>> {
  return localForage.getItem(constants.CIRCUIT_LIST);
}
function getStoredCircuitPathSync(): string | null {
  return localStorage.getItem(constants.CIRCUIT_PATH);
}


function getStoredTableRowData(circuitPath: string): Promise<Array<TableRowInterface>> {
  return localForage.getItem(generatePairStr(constants.ROWS_DATA, circuitPath));
}


export default {};

export {
  saveGeneralParams,
  saveCircuitList,
  saveCircuitSelected,
  getStoredGeneralPanelParams,
  getStoredGeneralPanelCircuitSelected,
  getStoredGeneralPanelCircuitList,
  getStoredCircuitPathSync,
  saveCircuitPathSync,
  saveTableRowData,
  getStoredTableRowData,
};
