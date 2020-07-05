
import { CircuitInterface } from '@/interfaces/general-panel';

const circuits: Array<CircuitInterface> = [
  {
    name: 'CA1.O1.20191017',
    path: '/store/hbp/ich002/public/CA1.O1/mooc_sonata_circuit/CircuitConfig',
    displayName: 'Hippocampus MOOC Microcircuit',
    mTypes: ['SP_AA', 'SR_SCA', 'SP_CCKBC', 'SO_OLM', 'SO_Tri', 'SP_PC', 'SP_BS', 'SLM_PPA', 'SP_PVBC', 'SO_BS', 'SO_BP', 'SP_Ivy'],
    synapseClasses: ['EXC', 'INH'],
  },
];

export default circuits;
