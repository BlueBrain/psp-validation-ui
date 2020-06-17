
import { HPCDefinition } from '@/interfaces/unicore';

const hpc: HPCDefinition = {
  BB5: {
    name: 'BlueBrain 5',
    id: 'bb5',
    url: 'https://bbpunicore.epfl.ch:8080/BB5-CSCS/rest/core',
  },
};

const tags = {
  VALIDATION: 'validation',
};

export default hpc;

export {
  tags,
};
