
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

export default {};

export {
  PspJobExtraParams,
  PlotsPathsObj,
};
