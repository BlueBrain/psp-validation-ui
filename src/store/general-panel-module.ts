
import {
  CircuitInterface,
  GeneralPanelParamsInterface,
  StoreStateInterface,
} from '@/interfaces/general-panel';

const lastUsedCircuitRaw = sessionStorage.getItem('circuit') || '{}';
const lastUsedCircuit: CircuitInterface = JSON.parse(lastUsedCircuitRaw);

const stateValues: StoreStateInterface = {
  currentCircuit: lastUsedCircuit as CircuitInterface,
  generalParams: {
    pairs: 4,
    repetitions: 3,
    clamp: 'Current',
    saveTraces: true,
    saveAmplitudes: false,
  },
};

const tableEditingModule = {
  state: stateValues,
  mutations: {
    setCurrentCircuitObj(state: StoreStateInterface, newCircuit: CircuitInterface) {
      sessionStorage.setItem('circuit', JSON.stringify(newCircuit));
      state.currentCircuit = newCircuit;
    },
    setGeneralPanelParams(state: StoreStateInterface, newParams: GeneralPanelParamsInterface) {
      state.generalParams = newParams;
    },
  },
};

export default tableEditingModule;
