
import { GeneralJobDefinition } from '@/interfaces/unicore';
import { RUN_SCRIPT_NAME } from '@/constants/hpc-systems';

const defaultJobConfig: GeneralJobDefinition = {
  title: '',
  runtime: '10h',
  nodes: 1,
  cpusPerNode: 72,
  memory: '8G',
  nodeType: 'cpu',
  project: 'proj133',
  executable: `/bin/sh ${RUN_SCRIPT_NAME}`,
  tags: [],
  imports: [],
  partition: 'prod',
};

export default defaultJobConfig;
