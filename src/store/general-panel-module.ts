
import {
  CircuitInterface,
  GeneralPanelParamsInterface,
  StoreStateInterface,
} from '@/interfaces/general-panel';

const stateValues: StoreStateInterface = {
  currentCircuit: {} as CircuitInterface,
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
      state.currentCircuit = newCircuit;
    },
    setGeneralPanelParams(state: StoreStateInterface, newParams: GeneralPanelParamsInterface) {
      state.generalParams = newParams;
    },
  },
};

export default tableEditingModule;
