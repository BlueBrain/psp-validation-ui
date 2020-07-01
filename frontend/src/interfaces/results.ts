
import { JobProperties } from '@/interfaces/unicore';

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

export default {};

export {
  MainTableInterface,
  ValidationsExpanded,
};
