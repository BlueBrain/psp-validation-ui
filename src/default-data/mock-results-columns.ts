
import ResultsTableExpand from '@/components/validation-list/ResultsTableExpand.vue';

const columns = [
  {
    type: 'expand',
    width: 50,
    /* eslint-disable-next-line */
    render: (h: any, params: any) => {
      console.log(params.row.expanded);
      const expandedRowInfo = params.row.expanded;
      return h(ResultsTableExpand, {
        props: {
          row: expandedRowInfo,
        },
      });
    },
  },
  {
    title: 'Job Name',
    slot: 'results-viewer',
    align: 'center',
    path: 'main.name',
  },
  {
    title: 'Launched',
    slot: 'results-viewer',
    align: 'center',
    path: 'main.date',
  },
  {
    title: 'Status',
    slot: 'status-slot',
    align: 'center',
    path: 'main.status',
  },
];

export default columns;
