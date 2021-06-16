
import { HPCComputer } from '@/interfaces/unicore';

interface HpcStateInterface {
  hpc: HPCComputer;
}

const hpcState: HpcStateInterface = {
  hpc: {} as HPCComputer,
};

const hpcModule = {
  state: hpcState,
  mutations: {
    setHpc(state: HpcStateInterface, hpcSystem: HPCComputer) {
      state.hpc = hpcSystem;
    },
  },
};

export default hpcModule;
