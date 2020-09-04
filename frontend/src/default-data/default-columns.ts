
import { ColumnIndexToPathMappingInterface } from '@/interfaces/table';
import { ruleNames } from '@/constants/rule-names';

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
  launched: 'launched',
  startedBy: 'startedBy',
  status: 'status',
};

function getPathByKey(key: string): string {
  const path = columnIndexToPathMapping[key];
  return path;
}

const columns = [
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
            rules: [ruleNames.FLOAT],
          },
          {
            title: 'std',
            align: 'center',
            width: tableConstants.WIDTH_CHILDREN,
            slot: 'string-editor',
            path: getPathByKey('ampStd'),
            rules: [ruleNames.POSITIVE],
          },
          {
            title: 'link to paper',
            align: 'center',
            width: tableConstants.WIDTH_CHILDREN,
            slot: 'link-editor',
            path: getPathByKey('ampLink'),
            className: 'link-paper',
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
            rules: [ruleNames.FLOAT],
          },
          {
            title: 'std',
            align: 'center',
            width: tableConstants.WIDTH_CHILDREN,
            slot: 'string-editor',
            path: getPathByKey('synStd'),
            rules: [ruleNames.POSITIVE],
          },
          {
            title: 'link to paper',
            align: 'center',
            width: tableConstants.WIDTH_CHILDREN,
            slot: 'link-editor',
            path: getPathByKey('synLink'),
            className: 'link-paper',
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
        rules: [ruleNames.POSITIVE, ruleNames.INT],
      },
      {
        title: 'max number of synapses',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('maxNumSyn'),
        rules: [ruleNames.POSITIVE, ruleNames.INT],
      },
      {
        title: 'max distance in x',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('maxDistX'),
        rules: [ruleNames.POSITIVE],
      },
      {
        title: 'max distance in y',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('maxDistY'),
        rules: [ruleNames.POSITIVE],
      },
      {
        title: 'max distance in z',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('maxDistZ'),
        rules: [ruleNames.POSITIVE],
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
        rules: [ruleNames.FLOAT],
      },
      {
        title: 'post ttx',
        align: 'center',
        width: tableConstants.WIDTH_CHILDREN,
        slot: 'string-editor',
        path: getPathByKey('postTtx'),
        rules: [],
      },
    ],
  },
  {
    title: 'Actions',
    width: tableConstants.WIDTH_CHILDREN,
    slot: 'actions',
    align: 'center',
  },
];

export default columns;

export {
  getPathByKey,
};
