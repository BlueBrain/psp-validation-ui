
interface CircuitInterface {
  name: string;
  path: string;
  displayName: string;
  mTypes: Array<string>;
  synapseClasses: Array<string>;
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
  circuitList: Array<CircuitInterface>;
  circuitPath: string;
  generalParams: GeneralPanelParamsInterface;
}

interface JobUserSelectedParams {
  name: string;
  project: string;
}

interface CircuitInfoResponse {
  m_types: Array<string>;
  synapse_classes: Array<string>;
}

interface StoredCircuitAndList {
  circuit: CircuitInterface;
  list: Array<CircuitInterface>;
}

export default {};

export {
  CircuitInterface,
  GeneralPanelParamsInterface,
  StoreStateInterface,
  JobUserSelectedParams,
  CircuitInfoResponse,
  StoredCircuitAndList,
};
