
import { DataToUpload, JobProperties } from '@/interfaces/unicore';

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

interface ExpandedTableInfoInterface {
  name: string;
}

interface ResultDataInterface {
  main: MainTableInterface;
  expanded: ExpandedTableInfoInterface;
}

export default {};

export {
  MainTableInterface,
  ResultDataInterface,
  ValidationsWithFiles,
  ExpandedTableInfoInterface,
};
