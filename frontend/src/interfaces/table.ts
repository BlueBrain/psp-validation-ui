
interface TableEntryObjectInterface {
  value: string;
  isEditing?: boolean;
  hasError?: boolean;
}

interface TableColumnInterface {
  title: string;
  width?: number;
  slot?: string; // TODO how to make mandatory except if has children?
  path: string;
  align: string;
  className?: string;
  rules: Array<string>;
  // children?: TableColumnInterface[];
}

interface ColumnIndexToPathMappingInterface {
  [index: string]: string;
  preSyn: string;
  postSyn: string;
  ampMean: string;
  ampStd: string;
  ampLink: string;
  synMean: string;
  synStd: string;
  synLink: string;
  minNumSyn: string;
  maxNumSyn: string;
  maxDistX: string;
  maxDistY: string;
  maxDistZ: string;
  holdV: string;
  postTtx: string;
}

interface Target {
  targetName: string;
  propertyDef: string;
  propertyValue: string;
  isEditing?: boolean;
}

interface TableRowInterface {
  id: string;
  pathway: {
    preSyn: Target;
    postSyn: Target;
    constraints: {
      uniqueGids: TableEntryObjectInterface;
      minNumSyn: TableEntryObjectInterface;
      maxNumSyn: TableEntryObjectInterface;
      maxDistX: TableEntryObjectInterface;
      maxDistY: TableEntryObjectInterface;
      maxDistZ: TableEntryObjectInterface;
    };
  };
  reference: {
    author: TableEntryObjectInterface;
    pspAmplitude: {
      mean: TableEntryObjectInterface;
      std: TableEntryObjectInterface;
      link: TableEntryObjectInterface;
    };
    synapseCount: {
      mean: TableEntryObjectInterface;
      std: TableEntryObjectInterface;
      link: TableEntryObjectInterface;
    };
  };
  protocol: {
    recordDt: TableEntryObjectInterface;
    holdV: TableEntryObjectInterface;
    tStim: TableEntryObjectInterface;
    tStop: TableEntryObjectInterface;
    postTtx: TableEntryObjectInterface;
  };
}

/* eslint-disable camelcase */
interface RowToYamlInterface {
  pathway: {
    pre: string;
    post: string;
    constraints: {
      unique_gids: boolean;
      min_nsyn: number | false;
      max_nsyn: number | false;
      max_dist_x: number | false;
      max_dist_y: number | false;
      max_dist_z: number | false;
    };
  };
  reference: {
    author: string;
    psp_amplitude: {
      mean: number | false;
      std: number | false;
      link: string | false;
    };
    synapse_count: {
      mean: number | false;
      std: number | false;
      link: string | false;
    };
  };
  protocol: {
    record_dt: number | false;
    hold_V: number | false;
    t_stim: number | false;
    t_stop: number | false;
    // TODO ttx is number or boolean?
    post_ttx: number | boolean;
  };
}
/* eslint-enable camelcase */


interface MTypeConstantsInterface {
  name: string;
  cells: number;
  displayName: string;
}

interface TargetQuery {
  M_TYPE: string;
  SYNAPSE_CLASS: string;
}

interface CheckResultInterface {
  message: string;
  hasError: boolean;
}

interface ChangeTableCellEventInterface {
  path: string;
  newTarget: Target;
  newValue: string | boolean;
  message: string;
}

interface StoreStateInterface {
  currentlyEditingRowIndex: number;
  currentlyEditingPath: string;
  currentlyEditingValue: string;
  currentlyEditingTarget: Target;
  currentlyEditingRules: Array<string>;
}

interface EditingObject {
  rowIndex: number;
  path: string;
  value: string;
  target: Target;
  rules: Array<string>;
}

export default {};

export {
  TableRowInterface,
  TableEntryObjectInterface,
  TableColumnInterface,
  ColumnIndexToPathMappingInterface,
  Target,
  MTypeConstantsInterface,
  TargetQuery,
  CheckResultInterface,
  ChangeTableCellEventInterface,
  StoreStateInterface,
  EditingObject,
  RowToYamlInterface,
};
