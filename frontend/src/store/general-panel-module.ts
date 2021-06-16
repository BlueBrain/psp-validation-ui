
import {
  CircuitInterface,
  GeneralPanelParamsInterface,
  StoreStateInterface,
} from '@/interfaces/general-panel';
import moocBbpCircuit from '@/default-data/default-circuits';

const stateValues: StoreStateInterface = {
  currentCircuit: moocBbpCircuit,
  circuitList: [moocBbpCircuit] as Array<CircuitInterface>,
  // circuitPath will be used to identify the config for table data or jobs
  circuitPath: moocBbpCircuit.path,
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
    setCircuitList(state: StoreStateInterface, newCircuitList: Array<CircuitInterface>) {
      state.circuitList = newCircuitList;
    },
  },
  getters: {
    circuitPath: (state: StoreStateInterface): string => {
      const storedCircuitPath = state.circuitPath || moocBbpCircuit.path;
      return storedCircuitPath;
    },
    circuitName: (state: StoreStateInterface): string => (state.currentCircuit.displayName || 'job'),
    currentCircuit: (state: StoreStateInterface): CircuitInterface => (state.currentCircuit),
    currentCircuitList: (state: StoreStateInterface): Array<CircuitInterface> => (state.circuitList),
  },
  actions: {
    fetchCurrentCircuit(context: any) {
      context.commit('setCurrentCircuitObj', moocBbpCircuit);
      context.commit('setCircuitList', [moocBbpCircuit]);
    },
  },
};

export default tableEditingModule;
