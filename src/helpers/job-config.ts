
import { GeneralJobDefinition } from '@/interfaces/unicore';

const defaultJobConfig: GeneralJobDefinition = {
  title: '',
  runtime: 1800,
  nodes: 1,
  executable: '/bin/sh input.sh',
  tags: [],
  imports: [],
};

export default defaultJobConfig;
