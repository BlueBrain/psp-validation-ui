
import { DataToUpload, JobProperties } from '@/interfaces/unicore';
import { RowToYamlInterface } from '@/interfaces/table';

interface ValidationsWithFiles {
  files: Array<DataToUpload>;
  id: string;
  jobInfo: JobProperties;
}

interface MainTableInterface {
  name: string;
  status: string;
  date: string;
}

interface ResultDataInterface {
  main: MainTableInterface;
  expanded: Array<RowToYamlInterface>;
}

export default {};

export {
  MainTableInterface,
  ResultDataInterface,
  ValidationsWithFiles,
};
