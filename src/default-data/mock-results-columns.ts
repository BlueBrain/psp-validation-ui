
import ResultsTableExpand from '@/components/validation-list/ResultsTableExpand.vue';
import { getPathByKey } from '@/default-data/default-columns';

const columns = [
  {
    type: 'expand',
    width: 50,
    /* eslint-disable-next-line */
    render: (h: any, params: any) => {
      console.log(params);
      return h(ResultsTableExpand, {
        props: {
          row: params.row,
        },
      });
    },
  },
  {
    title: 'Pre Synaptic',
    slot: 'results-viewer',
    align: 'center',
    path: getPathByKey('preSyn'),
  },
  {
    title: 'Post Synaptic',
    slot: 'results-viewer',
    align: 'center',
    path: getPathByKey('postSyn'),
  },
  {
    title: 'Launched',
    slot: 'results-viewer',
    align: 'center',
    path: getPathByKey('launched'),
  },
  {
    title: 'Started By',
    slot: 'results-viewer',
    align: 'center',
    path: getPathByKey('startedBy'),
  },
  {
    title: 'Status',
    slot: 'status-slot',
    align: 'center',
    path: getPathByKey('status'),
  },
];

export default columns;
