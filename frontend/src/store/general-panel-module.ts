
import {
  CircuitInterface,
  GeneralPanelParamsInterface,
  StoreStateInterface,
} from '@/interfaces/general-panel';
import { StateInterface as RootStateInterface } from '@/interfaces/store';
import { getStoredCircuitPathSync } from '@/helpers/db';

const stateValues: StoreStateInterface = {
  currentCircuit: {} as CircuitInterface,
  // circuitPath will be used to identify the config for table data or jobs
  circuitPath: '',
  generalParams: {
    pairs: 4,
    repetitions: 3,
    clamp: 'Current',
    saveTraces: true,
    saveAmplitudes: false,
  } as GeneralPanelParamsInterface,
};

const tableEditingModule = {
  state: stateValues,
  mutations: {
    setCurrentCircuitObj(state: StoreStateInterface, newCircuit: CircuitInterface) {
      state.currentCircuit = newCircuit;
      state.circuitPath = newCircuit.path;
    },
    setGeneralPanelParams(state: StoreStateInterface, newParams: GeneralPanelParamsInterface) {
      state.generalParams = newParams;
    },
  },
  getters: {
    circuitPath: (state: StoreStateInterface, getters: any, rootState: RootStateInterface) => {
      const storedCircuitPath = state.circuitPath || getStoredCircuitPathSync(rootState.userId);
      return storedCircuitPath;
    },
    circuitName: (state: StoreStateInterface) => (state.currentCircuit.displayName || 'job'),
  },
};

export default tableEditingModule;
