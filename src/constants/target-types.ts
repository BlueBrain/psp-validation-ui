
import { MTypeConstantsInterface } from '@/interfaces/table';

const targetQuery = {
  M_TYPE: 'mType',
  SYNAPSE_CLASS: 'synapseClass',
};

const circuitMTypes: Array<MTypeConstantsInterface> = [
  { name: 'Mosaic', displayName: '', cells: 18186 },
  { name: 'All', displayName: '', cells: 18186 },
  { name: 'Random1PercFull', displayName: 'Random 1% full circuit', cells: 6 },
  { name: 'Random5PercFull', displayName: 'Random 5% full circuit', cells: 13 },
  { name: 'Random10PercFull', displayName: 'Random 10% full circuit', cells: 16 },
  { name: 'Random500Central', displayName: 'Random 500 central column', cells: 500 },
  { name: 'Random1KCentral', displayName: 'Random 1K central column', cells: 1000 },
  { name: 'Excitatory', displayName: '', cells: 16860 },
  { name: 'Inhibitory', displayName: '', cells: 1326 },
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
  { name: 'bAC', displayName: '', cells: 529 },
  { name: 'cAC', displayName: '', cells: 345 },
  { name: 'cACpyr', displayName: '', cells: 16860 },
  { name: 'cNAC', displayName: '', cells: 452 },
  { name: 'SR', displayName: '', cells: 24 },
  { name: 'SP', displayName: '', cells: 18002 },
  { name: 'SLM', displayName: '', cells: 4 },
  { name: 'SO', displayName: '', cells: 156 },
  { name: 'mc0_Column', displayName: '', cells: 2556 },
  { name: 'mc1_Column', displayName: '', cells: 2713 },
  { name: 'mc2_Column', displayName: '', cells: 2495 },
  { name: 'mc3_Column', displayName: '', cells: 2638 },
  { name: 'mc4_Column', displayName: '', cells: 2582 },
  { name: 'mc5_Column', displayName: '', cells: 2638 },
  { name: 'mc6_Column', displayName: '', cells: 2564 },
  { name: 'SC-Exc', displayName: '', cells: NaN },
  { name: 'PV', displayName: '', cells: 470 },
  { name: 'BS', displayName: '', cells: 119 },
  { name: 'BC', displayName: '', cells: 494 },
  { name: 'SP_INT', displayName: '', cells: 1142 },
  { name: 'INT', displayName: '', cells: 1326 },
  { name: 'Minicolumn', displayName: '', cells: 2638 },
];

export default {};

export {
  targetQuery,
  circuitMTypes,
};
