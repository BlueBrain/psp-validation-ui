
import { DataToUpload } from '@/interfaces/unicore';
import jsYaml from 'js-yaml';

function getUserByLog(log: Array<string>): string {
  console.log(log);
  return '';
}

function getPathways(files: Array<DataToUpload>) {
  const pathways: Array<string> = [];
  files.forEach((f: DataToUpload) => {
    f.Data.match('');
  });
  console.log(pathways);
}

function transformYamlToObj(yaml: string) {
  return jsYaml.load(yaml);
}

export default {};

export {
  getUserByLog,
  getPathways,
  transformYamlToObj,
};
