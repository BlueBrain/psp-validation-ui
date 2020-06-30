
import { TableRowInterface } from '@/interfaces/table';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuidv4 } from 'uuid';
import { targetQuery } from '@/constants/target-types';

const row1: TableRowInterface = {
  id: uuidv4(),
  pathway: {
    preSyn: {
      targetName: 'M_TYPE:SP_PC',
      propertyDef: targetQuery.M_TYPE,
      propertyValue: 'SP_PC',
    },
    postSyn: {
      targetName: 'M_TYPE:SP_PC',
      propertyDef: targetQuery.M_TYPE,
      propertyValue: 'SP_PC',
    },
    constraints: {
      uniqueGids: {
        value: 'true',
      },
      minNumSyn: {
        value: 'None',
      },
      maxNumSyn: {
        value: '2',
      },
      maxDistX: {
        value: '100.0',
      },
      maxDistY: {
        value: '100.0',
      },
      maxDistZ: {
        value: '100.0',
      },
    },
  },
  reference: {
    author: {
      value: 'Deuchars and Thomson 1996 (syn same article)',
    },
    pspAmplitude: {
      mean: {
        value: '0.7',
      },
      std: {
        value: '0.5',
      },
      link: {
        value: 'https://pubmed.ncbi.nlm.nih.gov/8895869',
      },
    },
    synapseCount: {
      mean: {
        value: '1.2',
      },
      std: {
        value: '0.0',
      },
      link: {
        value: 'None',
      },
    },
  },
  protocol: {
    recordDt: {
      value: '0.1',
    },
    holdV: {
      value: '-70.67',
    },
    tStim: {
      value: '800.0',
    },
    tStop: {
      value: '900.0',
    },
    postTtx: {
      value: 'false',
    },
  },
};

const row2: TableRowInterface = {
  id: uuidv4(),
  pathway: {
    preSyn: {
      targetName: 'M_TYPE:SP_PVBC',
      propertyDef: targetQuery.M_TYPE,
      propertyValue: 'SP_PVBC',
    },
    postSyn: {
      targetName: 'M_TYPE:SP_PC',
      propertyDef: targetQuery.M_TYPE,
      propertyValue: 'SP_PC',
    },
    constraints: {
      uniqueGids: {
        value: 'true',
      },
      minNumSyn: {
        value: '7',
      },
      maxNumSyn: {
        value: '14',
      },
      maxDistX: {
        value: '100.0',
      },
      maxDistY: {
        value: '100.0',
      },
      maxDistZ: {
        value: '100.0',
      },
    },
  },
  reference: {
    author: {
      value: 'Pawelzik 2002 (syn Foldy 2010)',
    },
    pspAmplitude: {
      mean: {
        value: '0.83',
      },
      std: {
        value: '0.37',
      },
      link: {
        value: 'https://pubmed.ncbi.nlm.nih.gov/11807843',
      },
    },
    synapseCount: {
      mean: {
        value: '11.0',
      },
      std: {
        value: '0.6',
      },
      link: {
        value: 'https://pubmed.ncbi.nlm.nih.gov/20676104',
      },
    },
  },
  protocol: {
    recordDt: {
      value: '0.1',
    },
    holdV: {
      value: '-59.0',
    },
    tStim: {
      value: '800.0',
    },
    tStop: {
      value: '900.0',
    },
    postTtx: {
      value: 'false',
    },
  },
};

const row3: TableRowInterface = {
  id: uuidv4(),
  pathway: {
    preSyn: {
      targetName: 'M_TYPE:SP_PC',
      propertyDef: targetQuery.M_TYPE,
      propertyValue: 'SP_PC',
    },
    postSyn: {
      targetName: 'M_TYPE:SO_OLM',
      propertyDef: targetQuery.M_TYPE,
      propertyValue: 'SO_OLM',
    },
    constraints: {
      uniqueGids: {
        value: 'true',
      },
      minNumSyn: {
        value: '2',
      },
      maxNumSyn: {
        value: '5',
      },
      maxDistX: {
        value: '200.0',
      },
      maxDistY: {
        value: '200.0',
      },
      maxDistZ: {
        value: '200.0',
      },
    },
  },
  reference: {
    author: {
      value: 'Ali & Thomson 1998 0.3+/-0.13 (outliers removed...) (syn Biro 2005)',
    },
    pspAmplitude: {
      mean: {
        value: '0.3',
      },
      std: {
        value: '0.13',
      },
      link: {
        value: 'https://pubmed.ncbi.nlm.nih.gov/9490837',
      },
    },
    synapseCount: {
      mean: {
        value: '2.3',
      },
      std: {
        value: '0.8',
      },
      link: {
        value: 'https://pubmed.ncbi.nlm.nih.gov/15634785',
      },
    },
  },
  protocol: {
    recordDt: {
      value: '0.1',
    },
    holdV: {
      value: '-72.17',
    },
    tStim: {
      value: '800.0',
    },
    tStop: {
      value: '900.0',
    },
    postTtx: {
      value: 'false',
    },
  },
};

const defaultData: Array<TableRowInterface> = cloneDeep([row1, row2, row3]);
export default defaultData;
