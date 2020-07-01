
const columns = [
  {
    title: 'Name',
    align: 'center',
    key: 'name',
    sortable: true,
  },
  {
    title: 'Launched',
    slot: 'date-viewer',
    align: 'center',
    key: 'date',
    sortable: true,
  },
  {
    title: 'Status',
    slot: 'status-slot',
    align: 'center',
    key: 'status',
    sortable: true,
  },
];

export default columns;
