
import { TableColumnInterface, ColumnIndexToPathMappingInterface } from '@/interfaces/table';

const tableConstants = {
  WIDTH_CHILDREN: 148,
  WIDTH_HEADERS: 200,
};

const columnIndexToPathMapping: ColumnIndexToPathMappingInterface = {
  preSyn: 'pathway.preSyn',
  postSyn: 'pathway.postSyn',
  ampMean: 'reference.pspAmplitude.mean',
  ampStd: 'reference.pspAmplitude.std',
  ampLink: 'reference.pspAmplitude.link',
  synMean: 'reference.synapseCount.mean',
  synStd: 'reference.synapseCount.std',
  synLink: 'reference.synapseCount.link',
  minNumSyn: 'pathway.constraints.minNumSyn',
  maxNumSyn: 'pathway.constraints.maxNumSyn',
  maxDistX: 'pathway.constraints.maxDistX',
  maxDistY: 'pathway.constraints.maxDistY',
  maxDistZ: 'pathway.constraints.maxDistZ',
  holdV: 'protocol.holdV',
  postTtx: 'protocol.postTtx',
};

function getPathByKey(key: string): string {
  const path = columnIndexToPathMapping[key];
  return path;
}

const columns: Array<TableColumnInterface> = [
  {
    title: 'Pre Synaptic',
    width: tableConstants.WIDTH_HEADERS,
    slot: 'target-editor',
    align: 'center',
    path: getPathByKey('preSyn'),
  },
  {
    title: 'Post Synaptic',
    width: tableConstants.WIDTH_HEADERS,
    slot: 'target-editor',
    align: 'center',
    path: getPathByKey('postSyn'),
  },
  {
    title: 'Reference',
    align: 'center',
    children: [
      {
        title: 'PSP Amplitude',
        align: 'center',
        children: [
          {
            title: 'mean',
            align: 'center',
            width: tableConstants.WIDTH_CHILDREN,
            slot: 'string-editor',
            path: getPathByKey('ampMean'),
          },
          {
            title: 'std',
            align: 'center',
            width: tableConstants.WIDTH_CHILDREN,
            slot: 'string-editor',
            path: getPathByKey('ampStd'),
          },
          {
            title: 'link to paper',
            align: 'center',
            width: tableConstants.WIDTH_CHILDREN,
            slot: 'string-editor',
            path: getPathByKey('ampLink'),
          },
        ],
      },
      {
        title: 'Synapse Count',
        align: 'center',
        children: [
          {
            title: 'mean',
            align: 'center',
            width: tableConstants.WIDTH_CHILDREN,
            slot: 'string-editor',
            path: getPathByKey('synMean'),
          },
          {
            title: 'std',
            align: 'center',
            width: tableConstants.WIDTH_CHILDREN,
            slot: 'string-editor',
            path: getPathByKey('synStd'),
          },
          {
            title: 'link to paper',
            align: 'center',
            width: tableConstants.WIDTH_CHILDREN,
            slot: 'string-editor',
            path: getPathByKey('synLink'),
          },
        ],
      },
    ],
  },
  {
    title: 'Pathways Constraints',
    align: 'center',
    children: [
      {
        title: 'min number of synapses',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('minNumSyn'),
      },
      {
        title: 'max number of synapses',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('maxNumSyn'),
      },
      {
        title: 'max distance in x',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('maxDistX'),
      },
      {
        title: 'max distance in y',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('maxDistY'),
      },
      {
        title: 'max distance in z',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('maxDistZ'),
      },
    ],
  },
  {
    title: 'Prototol',
    align: 'center',
    children: [
      {
        title: 'steady-state voltage',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('holdV'),
      },
      {
        title: 'post ttx',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('postTtx'),
      },
    ],
  },
];

export default columns;
