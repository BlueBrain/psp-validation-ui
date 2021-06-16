
import { HPCDefinition } from '@/interfaces/unicore';

const hpc: HPCDefinition = {
  BB5: {
    name: 'Service Account (BlueBrain5)',
    id: 'bb5',
    // url: 'https://bbpunicore.epfl.ch:8080/BB5-CSCS/rest/core',
    url: 'https://127.0.0.1:5000/rest/core',
  },
};

const tags = {
  VALIDATION: 'psp-validation',
};

const RUN_SCRIPT_NAME = 'input.sh';

export default hpc;

export {
  tags,
  RUN_SCRIPT_NAME,
};
