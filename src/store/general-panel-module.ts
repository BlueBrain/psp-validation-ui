
import {
  CircuitInterface,
  GeneralPanelParamsInterface,
  StoreStateInterface,
} from '@/interfaces/general-panel';
import { StateInterface as RootStateInterface } from '@/interfaces/store';
import { getStoredCircuitPathSync } from '@/helpers/db';

const stateValues: StoreStateInterface = {
  currentCircuit: {} as CircuitInterface,
  // as we need to save some params like table data or find jobs
  // using a circuit identifier, we will use circuitPath with this purpose
  circuitPath: '',
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
  getters: {
    circuitPath: (state: StoreStateInterface, getters: any, rootState: RootStateInterface) => {
      const storedCircuitPath = getStoredCircuitPathSync(rootState.userId) || '';
      return storedCircuitPath;
    },
  },
};

export default tableEditingModule;
