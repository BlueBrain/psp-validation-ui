
import { DataToUpload } from '@/interfaces/unicore';
import { transformYamlToObj } from '@/helpers/yaml-helper';

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

export default {};

export {
  getUserByLog,
  getPathways,
  transformYamlToObj,
};
