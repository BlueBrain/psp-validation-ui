
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuidv4 } from 'uuid';
import { targetQuery } from '@/constants/target-types';

const row1 = {
  id: uuidv4(),
  pathway: {
    preSyn: {
      name: 'SP_PC_PRE',
      query: targetQuery.M_TYPE,
      value: 'SP_PC',
    },
    postSyn: {
      name: 'SP_PC_POST',
      query: targetQuery.M_TYPE,
      value: 'SP_PC',
    },
    constraints: {
      uniqueGids: {
        value: 'true',
      },
      minNumSyn: {
        value: '4',
      },
      maxNumSyn: {
        value: '10',
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
      value: 'Magee and Cook 2000',
    },
    pspAmplitude: {
      mean: {
        value: '0.2',
      },
      std: {
        value: '0.2',
      },
      link: {
        value: 'https://test.co.uk/paper/this-is-an-example-of-a-long-link.html',
      },
    },
    synapseCount: {
      mean: {
        value: '0.2',
      },
      std: {
        value: '0.2',
      },
      link: {
        value: 'https://test.co.uk/paper/this-is-an-example-of-a-long-link.html',
      },
    },
  },
  protocol: {
    recordDt: {
      value: '0.1',
    },
    holdV: {
      value: '-77.0',
    },
    tStim: {
      value: '800.0',
    },
    tStop: {
      value: '900.0',
    },
    postTtx: {
      value: '0.8',
    },
  },
  status: {
    value: 'Done',
  },
  launched: {
    value: '02.03.2020',
  },
  startedBy: {
    value: 'Romani',
  },
};

const row2 = {
  id: uuidv4(),
  pathway: {
    preSyn: {
      name: 'SP_PC_PRE_2',
      query: targetQuery.M_TYPE,
      value: 'SP_PC',
    },
    postSyn: {
      name: 'Mosaic Post',
      query: targetQuery.M_TYPE,
      value: 'Mosaic',
    },
    constraints: {
      uniqueGids: {
        value: 'true',
      },
      minNumSyn: {
        value: '4',
      },
      maxNumSyn: {
        value: '10',
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
      value: 'Magee and Cook 2000',
    },
    pspAmplitude: {
      mean: {
        value: '0.2',
      },
      std: {
        value: '0.2',
      },
      link: {
        value: 'https://test.co.uk/paper/this-is-an-example-of-a-long-link.html',
      },
    },
    synapseCount: {
      mean: {
        value: '0.2',
      },
      std: {
        value: '0.2',
      },
      link: {
        value: 'https://test.co.uk/paper/this-is-an-example-of-a-long-link.html',
      },
    },
  },
  protocol: {
    recordDt: {
      value: '0.1',
    },
    holdV: {
      value: '-77.0',
    },
    tStim: {
      value: '800.0',
    },
    tStop: {
      value: '900.0',
    },
    postTtx: {
      value: '0.8',
    },
  },
  status: {
    value: 'Done',
  },
  launched: {
    value: '02.03.2020',
  },
  startedBy: {
    value: 'Romani',
  },
};

const defaultData = cloneDeep([row1, row2]);
export default defaultData;
