
import { GeneralJobDefinition } from '@/interfaces/unicore';
import { RUN_SCRIPT_NAME } from '@/constants/hpc-systems';

const defaultJobConfig: GeneralJobDefinition = {
  title: '',
  runtime: 14400, // 4hs
  cpus: 1,
  memory: '2G',
  project: 'proj42',
  executable: `/bin/sh ${RUN_SCRIPT_NAME}`,
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
  'psp -vv run -c <%= blueConfigPath %> -o . -t $TARGETS -n <%= pairs %> '
    + '-r <%= trials %> <%= saveTraces %> <%= saveAmplitudes %> <%= yamlFiles %>',
  'psp -vv plot -o . ./*.traces.h5',
];

export default defaultJobConfig;

export {
  validationScript,
};
