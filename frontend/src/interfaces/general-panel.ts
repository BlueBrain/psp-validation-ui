
interface CircuitInterface {
  name: string;
  path: string;
  displayName: string;
}

interface GeneralPanelParamsInterface {
  pairs: number;
  repetitions: number;
  clamp: string;
  saveTraces: boolean;
  saveAmplitudes: boolean;
}

interface StoreStateInterface {
  currentCircuit: CircuitInterface;
  circuitPath: string;
  generalParams: GeneralPanelParamsInterface;
}

interface JobUserSelectedParams {
  name: string;
  project: string;
}

export default {};

export {
  CircuitInterface,
  GeneralPanelParamsInterface,
  StoreStateInterface,
  JobUserSelectedParams,
};
