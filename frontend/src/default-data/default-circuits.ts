
import { CircuitInterface } from '@/interfaces/general-panel';

const moocBbpCircuit: CircuitInterface = {
  name: 'mooc-circuit',
  path: '/gpfs/bbp.cscs.ch/project/proj133/circuit/mooc-circuit/CircuitConfig',
  displayName: 'Hippocampus MOOC Microcircuit',
  mTypes: ['SP_AA', 'SR_SCA', 'SP_CCKBC', 'SO_OLM', 'SO_Tri', 'SP_PC', 'SP_BS', 'SLM_PPA', 'SP_PVBC', 'SO_BS', 'SO_BP', 'SP_Ivy'],
  synapseClasses: ['EXC', 'INH'],
};

export default moocBbpCircuit;
