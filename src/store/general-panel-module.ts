
import { CircuitInterface } from '@/interfaces/general-panel';

const tableEditingModule = {
  state: {
    currentCircuit: {} as CircuitInterface,
  },
  mutations: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    setCurrentCircuitObj(state: any, newCircuit: CircuitInterface) {
      state.currentCircuit = newCircuit;
    },
  },
};

export default tableEditingModule;
