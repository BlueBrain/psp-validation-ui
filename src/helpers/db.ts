
import localForage from 'localforage';
import { CircuitInterface, GeneralPanelParamsInterface } from '@/interfaces/general-panel';
import { TableRowInterface } from '@/interfaces/table';

function saveCircuitList(circuitList: Array<CircuitInterface>) {
  localForage.setItem('circuitList', circuitList);
}
function saveCircuitSelected(circuitSelected: CircuitInterface) {
  localForage.setItem('circuitSelected', circuitSelected);
}
function saveGeneralParams(generalParams: GeneralPanelParamsInterface) {
  localForage.setItem('generalPanelParams', generalParams);
}

function saveTableRowData(rowsData: Array<TableRowInterface>, circuitPath: string) {
  localForage.setItem(`rowsData - ${circuitPath}`, rowsData);
}

function getStoredGeneralPanelParams(): Promise<GeneralPanelParamsInterface> {
  return localForage.getItem('generalPanelParams');
}
function getStoredGeneralPanelCircuitSelected(): Promise<CircuitInterface> {
  return localForage.getItem('circuitSelected');
}
function getStoredGeneralPanelCircuitList(): Promise<Array<CircuitInterface>> {
  return localForage.getItem('circuitList');
}

function getStoredTableRowData(circuitPath: string): Promise<Array<TableRowInterface>> {
  return localForage.getItem(`rowsData - ${circuitPath}`);
}


export default {};

export {
  saveGeneralParams,
  saveCircuitList,
  saveCircuitSelected,
  getStoredGeneralPanelParams,
  getStoredGeneralPanelCircuitSelected,
  getStoredGeneralPanelCircuitList,
  saveTableRowData,
  getStoredTableRowData,
};
