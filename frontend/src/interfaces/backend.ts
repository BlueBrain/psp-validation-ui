
import {
  GeneralPanelParamsInterface,
  JobUserSelectedParams,
} from '@/interfaces/general-panel';

interface PspJobExtraParams extends JobUserSelectedParams {
  userId: string;
  generalParams: GeneralPanelParamsInterface;
}

interface PlotsPathsObj {
  plotPathArray: Array<string>;
  pathwayName: string;
  pairsArray: Array<{
    plotData: string;
    name: string;
  }>
}

interface FilesTreeInterface {
  title: string;
  expand?: boolean;
  selected?: boolean;
  checked? : boolean;
  children?: Array<FilesTreeInterface>;
}

export default {};

export {
  PspJobExtraParams,
  FilesTreeInterface,
  PlotsPathsObj,
};
