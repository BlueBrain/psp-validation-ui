
import { DataToUpload, JobProperties } from '@/interfaces/unicore';
import { RowToYamlInterface } from '@/interfaces/table';

interface ValidationsExpanded {
  id: string;
  jobInfo: JobProperties;
}

interface MainTableInterface {
  name: string;
  status: string;
  date: string;
  id: string;
}

interface ResultDataInterface {
  main: MainTableInterface;
}

export default {};

export {
  MainTableInterface,
  ResultDataInterface,
  ValidationsExpanded,
};
