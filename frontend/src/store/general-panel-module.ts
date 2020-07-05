
import {
  CircuitInterface,
  GeneralPanelParamsInterface,
  StoreStateInterface,
  StoredCircuitAndList,
} from '@/interfaces/general-panel';
import defaultCircuits from '@/default-data/default-circuits';
import { getAsyncStoredCircuitAndList } from '@/helpers/backend-helper';

const moocCircuit: CircuitInterface = defaultCircuits[0];

const stateValues: StoreStateInterface = {
  currentCircuit: moocCircuit,
  circuitList: defaultCircuits as Array<CircuitInterface>,
  // circuitPath will be used to identify the config for table data or jobs
  circuitPath: moocCircuit.path,
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
      const storedCircuitPath = state.circuitPath || moocCircuit.path;
      return storedCircuitPath;
    },
    circuitName: (state: StoreStateInterface): string => (state.currentCircuit.displayName || 'job'),
    currentCircuit: (state: StoreStateInterface): CircuitInterface => (state.currentCircuit),
    currentCircuitList: (state: StoreStateInterface): Array<CircuitInterface> => (state.circuitList),
  },
  actions: {
    fetchCurrentCircuit(context: any) {
      const { userId } = context.rootState;
      getAsyncStoredCircuitAndList(userId, defaultCircuits)
        .then((circuitAndList: StoredCircuitAndList) => {
          context.commit('setCurrentCircuitObj', circuitAndList.circuit);
          context.commit('setCircuitList', circuitAndList.list);
        });
    },
  },
};

export default tableEditingModule;
