
import { CircuitInterface, GeneralPanelParamsInterface } from '@/interfaces/general-panel';

const tableEditingModule = {
  state: {
    currentCircuit: {} as CircuitInterface,
    generalParams: {
      pairs: 4,
      repetitions: 3,
      clamp: 'Current',
      saveTraces: true,
      saveAmplitudes: false,
    },
  },
  mutations: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    setCurrentCircuitObj(state: any, newCircuit: CircuitInterface) {
      state.currentCircuit = newCircuit;
    },
    setGeneralPanelParams(state: any, newParams: GeneralPanelParamsInterface) {
      state.generalParams = newParams;
    },
  },
};

export default tableEditingModule;
