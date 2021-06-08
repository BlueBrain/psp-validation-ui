
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

const validationScript: Array<string> = [
  '#!/bin/bash -l',
  '. /etc/profile',
  'env | grep SLURM',
  '# http://usertest.cscs.ch/access/faq/#how-to-avoid-the-warning-_pmi_alps_get_apid-alps-response-not-okay-',
  'export PMI_NO_FORK=1',
  'export PMI_NO_PREINITIALIZE=1',
  'export PMI_MMAP_SYNC_WAIT_TIME=300',
  'module load PrgEnv-intel',
  'module load daint-mc cray-python/3.8.2.1 PyExtensions/python3-CrayGNU-20.11',
  'module unuse /apps/hbp/ich002/hbp-spack-deployments/softwares/27-10-2020/install/modules/tcl/cray-cnl7-haswell',
  'module unuse /apps/hbp/ich002/hbp-spack-deployments/softwares/12-02-2021/install/modules/tcl/cray-cnl7-haswell',
  'module use /apps/hbp/ich002/hbp-spack-deployments/softwares/12-02-2021/install/modules/tcl/cray-cnl7-haswell',
  'module load h5py/2.10.0-CrayGNU-20.11-python3-serial',
  'module load neurodamus-hippocampus/1.4.1-3.2.0',
  '# module load py-bglibpy',
  'module load psp-validation/0.3.3',
  'module list',
  'export TARGETS="/store/hbp/ich002/public/psp/targets.yaml"',
  'export HDF5_USE_FILE_LOCKING=FALSE',
  '# psp --version',
  'psp -vv run -c <%= blueConfigPath %> -o . -t $TARGETS -n <%= pairs %> '
    + '-r <%= trials %> <%= saveTraces %> <%= saveAmplitudes %> '
    + '-j 0 <%= yamlFiles %>', // multitasking
  'if [ $? -eq 0 ]; then psp -vv plot -o . ./*.traces.h5; else echo "PSP FAIL" && false; fi',
];

export default defaultJobConfig;

export {
  validationScript,
};
