
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
  generalParams: {
    pairs: number;
    repetitions: number;
    clamp: string;
    saveTraces: boolean;
    saveAmplitudes: boolean
  }
}

export default {};

export {
  CircuitInterface,
  GeneralPanelParamsInterface,
  StoreStateInterface,
};