
import ResultsTableExpand from '@/components/validation-list/ResultsTableExpand.vue';
// import { RowToYamlInterface } from '@/interfaces/table';

const columns = [
  {
    type: 'expand',
    width: 50,
    /* eslint-disable-next-line */
    render: (h: any, params: any) => {
      const { id }: { id: string } = params.row.main;
      return h(ResultsTableExpand, {
        props: {
          id,
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
    title: 'Location',
    slot: 'results-viewer',
    align: 'center',
    path: 'main.location',
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
