
import { CircuitInterface } from '@/interfaces/general-panel';

const circuits: Array<CircuitInterface> = [
  {
    name: 'CA1.O1.20191017',
    path: '/gpfs/bbp.cscs.ch/home/antonel/proj42_home/O1/20191017/simulations/Mosaic5_2/CircuitConfig_local',
    displayName: 'Hippocampus MOOC Microcircuit 20191017',
    mTypes: ['SP_AA', 'SR_SCA', 'SP_CCKBC', 'SO_OLM', 'SO_Tri', 'SP_PC', 'SP_BS', 'SLM_PPA', 'SP_PVBC', 'SO_BS', 'SO_BP', 'SP_Ivy'],
    synapseClasses: ['EXC', 'INH'],
  },
  {
    name: 'CA1.20191017',
    path: '/gpfs/bbp.cscs.ch/project/proj42/circuits/CA1/20191025/CircuitConfig',
    displayName: 'Hippocampus Full 20191017',
    mTypes: ['SP_AA', 'SR_SCA', 'SP_CCKBC', 'SO_OLM', 'SO_Tri', 'SP_PC', 'SP_BS', 'SLM_PPA', 'SP_PVBC', 'SO_BS', 'SO_BP', 'SP_Ivy'],
    synapseClasses: ['EXC', 'INH'],
  },
];

export default circuits;
