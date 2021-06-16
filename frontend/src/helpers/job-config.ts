
import { GeneralJobDefinition } from '@/interfaces/unicore';
import { RUN_SCRIPT_NAME } from '@/constants/hpc-systems';

const defaultJobConfig: GeneralJobDefinition = {
  title: '',
  runtime: 86000, // ~24hs
  nodes: 1,
  cpusPerNode: 36,
  memory: null,
  nodeType: 'mc',
  project: 'normal',
  executable: `/bin/sh ${RUN_SCRIPT_NAME}`,
  tags: [],
  imports: [],
};

export default defaultJobConfig;
