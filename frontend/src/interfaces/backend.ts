
import { GeneralPanelParamsInterface } from '@/interfaces/general-panel';

interface PspJobExtraParams {
  userId: string;
  generalParams: GeneralPanelParamsInterface;
  title: string | null;
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
  title?: string;
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
