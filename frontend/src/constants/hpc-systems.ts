
import { HPCDefinition } from '@/interfaces/unicore';

const unicoreModeTag = process.env.VUE_APP_UNICORE_MODE_TAG || '';

const bb5VmmUrl = process.env.VUE_APP_VMM_URL;

const hpc: HPCDefinition = {
  BB5: {
    name: 'Service Account (BlueBrain5)',
    id: 'bb5',
    url: `${bb5VmmUrl}/rest/core`,
  },
};

const tags = {
  VALIDATION: 'psp-validation',
  UNICORE_MODE_TAG: unicoreModeTag,
};

const RUN_SCRIPT_NAME = 'input.sh';
const RUN_CONFIG_FILE = 'psp_config.json';
const PATHWAY_LIST = 'pathway_list.json';
const RUN_SCRIPT_PLACEHOLDER = 'PSP_SCRIPT_PLACEHOLDER';

export default hpc;

export {
  tags,
  RUN_SCRIPT_NAME,
  RUN_SCRIPT_PLACEHOLDER,
  RUN_CONFIG_FILE,
  PATHWAY_LIST,
};
