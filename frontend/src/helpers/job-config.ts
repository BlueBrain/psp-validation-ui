
import { GeneralJobDefinition } from '@/interfaces/unicore';

const defaultJobConfig: GeneralJobDefinition = {
  title: '',
  runtime: 3600,
  nodes: 1,
  executable: '/bin/sh input.sh',
  tags: [],
  imports: [],
};

const validationScript: Array<string> = [
  '#!/bin/bash - l',
  '. /etc/profile',
  'env | grep SLURM_NPROCS',
  'module load archive/2020-05',
  'module load py-bglibpy',
  'module load neurodamus-hippocampus',
  'module load psp-validation',
  'export TARGETS="/gpfs/bbp.cscs.ch/project/proj42/home/ecker/psp-validation/usecases/hippocampus/targets.yaml"',
  '# psp --version',
  'psp -vv run -c <%= blueConfigPath %> -o . -t $TARGETS -j 0 -n <%= pairs %> -r <%= trials %> <%= yamlFiles %>',
];

export default defaultJobConfig;

export {
  validationScript,
};
