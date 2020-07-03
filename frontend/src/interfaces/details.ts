
import { JobProperties } from '@/interfaces/unicore';
import { PlotsPathsObj } from '@/interfaces/backend';

interface FullResultsInfo {
  jobInfo: JobProperties;
  plotList: Array<PlotsPathsObj>,
}

export default {};

export {
  FullResultsInfo,
};
