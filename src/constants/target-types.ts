
import { MTypeConstantsInterface, TargetQuery } from '@/interfaces/table';

const targetQuery: TargetQuery = {
  M_TYPE: 'mType',
  SYNAPSE_CLASS: 'synapseClass',
};

const circuitMTypes: Array<MTypeConstantsInterface> = [
  // from bluepy.v2 import Circuit && c = Circuit('...') && c.cells.mtypes
  { name: 'SLM_PPA', displayName: '', cells: 4 },
  { name: 'SO_BP', displayName: '', cells: 2 },
  { name: 'SO_BS', displayName: '', cells: 28 },
  { name: 'SO_OLM', displayName: '', cells: 88 },
  { name: 'SO_Tri', displayName: '', cells: 38 },
  { name: 'SP_AA', displayName: '', cells: 80 },
  { name: 'SP_BS', displayName: '', cells: 91 },
  { name: 'SP_CCKBC', displayName: '', cells: 195 },
  { name: 'SP_Ivy', displayName: '', cells: 477 },
  { name: 'SP_PC', displayName: '', cells: 16860 },
  { name: 'SP_PVBC', displayName: '', cells: 299 },
  { name: 'SR_SCA', displayName: '', cells: 24 },
];

export default {};

export {
  targetQuery,
  circuitMTypes,
};
