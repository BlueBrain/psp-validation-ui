
import localForage from 'localforage';
import { CircuitInterface, GeneralPanelParamsInterface } from '@/interfaces/general-panel';

function saveCircuitList(circuitList: Array<CircuitInterface>) {
  localForage.setItem('circuitList', circuitList);
}
function saveCircuitSelected(circuitSelected: CircuitInterface) {
  localForage.setItem('circuitSelected', circuitSelected);
}
function saveGeneralParams(generalParams: GeneralPanelParamsInterface) {
  localForage.setItem('generalPanelParams', generalParams);
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

export default {};

export {
  saveGeneralParams,
  saveCircuitList,
  saveCircuitSelected,
  getStoredGeneralPanelParams,
  getStoredGeneralPanelCircuitSelected,
  getStoredGeneralPanelCircuitList,
};
