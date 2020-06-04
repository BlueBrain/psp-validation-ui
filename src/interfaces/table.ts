
interface TableRendererParams {
  column: {
    _index: number;
  };
  index: number;
}

interface TableEntryObjectInterface {
  value: string;
  isEditing?: boolean;
  hasError?: boolean;
}

interface TableColumnInterface {
  title: string;
  width?: number;
  slot?: string; // how to make mandatory except if has children?
  path?: string;
  align?: string;
  className?: string;
  children?: TableColumnInterface[];
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

interface Target extends TableEntryObjectInterface {
  name: string;
  query: string;
}

interface MTypeConstantsInterface {
  name: string;
  cells: number;
  displayName: string;
}

interface TargetQuery {
  M_TYPE: string;
  SYNAPSE_CLASS: string;
}


export default {};

export {
  TableRowInterface,
  TableRendererParams,
  TableEntryObjectInterface,
  TableColumnInterface,
  ColumnIndexToPathMappingInterface,
  Target,
  MTypeConstantsInterface,
  TargetQuery,
};
