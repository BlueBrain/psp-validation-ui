
<template>
  <div class="results-table">
    <Table
      :columns="columns"
      :data="rowData"
      ref="table"
      border
    >
      <template slot-scope="{ row, column, index }" slot="results-viewer">
        <ResultsViewer
          :row="row"
          :column="column"
          :index="index"
        />
      </template>
    </Table>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import defaultColumns from '@/default-data/default-results-columns';
import defaultRows from '@/default-data/default-results-rows';
import ResultsViewer from '@/components/validation-list/ResultsViewer.vue';

export default Vue.extend({
  name: 'ResultsTable',
  data() {
    return {
      columns: defaultColumns,
      rowData: defaultRows,
    };
  },
  components: {
    ResultsViewer,
  },
  created() {
    this.$store.commit('changeTitle', 'Validation List');
  },
});
</script>
