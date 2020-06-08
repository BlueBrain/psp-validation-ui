
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

export default {};

export {
  saveGeneralParams,
  saveCircuitList,
  saveCircuitSelected,
};
