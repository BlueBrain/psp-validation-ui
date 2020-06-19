
import {
  submitJob,
  setAxiosToken,
} from '@/helpers/unicore';
import defaultJobConfig from '@/helpers/job-config';
import { DataToUpload, JobProperties } from '@/interfaces/unicore';
import { getPrePostNames } from '@/helpers/yaml-helper';
import { tags } from '@/constants/hpc-systems';

function convertYamlToInputObj(yamlFile: string) {
  const preAndPost = getPrePostNames(yamlFile);
  const fileName = `${preAndPost.pre}-${preAndPost.post}.yaml`;
  const fileObj: DataToUpload = {
    Data: yamlFile,
    To: fileName,
  };
  return fileObj;
}

function submitPspJob(yamlFiles: Array<string>, circuitPath: string): Promise<JobProperties> {
  const runConfig = defaultJobConfig;
  if (runConfig.tags) {
    runConfig.tags.push(tags.VALIDATION);
    runConfig.tags.push(circuitPath);
  }
  const inputs: DataToUpload[] = [{
    Data: 'echo "Hello World"',
    To: 'input.sh',
  }];

  yamlFiles.forEach((yamlStr: string) => {
    const yamlObj = convertYamlToInputObj(yamlStr);
    inputs.push(yamlObj);
  });

  return submitJob(runConfig, inputs);
}

function setToken(token: string) {
  setAxiosToken(token);
}

export default {};

export {
  submitPspJob,
  setToken,
};
