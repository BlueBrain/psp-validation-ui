
<template>
  <div class="results-table">
    <Table
      :columns="columns"
      :data="rowData"
      :loading="isLoading"
      ref="table"
      border
    >
      <template slot-scope="{ row, column, index }" slot="results-viewer">
        <InlineResultViewer
          :row="row"
          :column="column"
          :index="index"
        />
      </template>

      <template slot-scope="{ row, column, index }" slot="status-slot">
        <InlineResultsStatus
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
import defaultColumns from '@/default-data/mock-results-columns';
import defaultRows from '@/default-data/mock-results-rows';
import InlineResultViewer from '@/components/validation-list/InlineResultViewer.vue';
import InlineResultsStatus from '@/components/validation-list/InlineResultStatus.vue';

export default Vue.extend({
  name: 'ResultsTable',
  props: {
    isLoading: Boolean,
  },
  data() {
    return {
      columns: defaultColumns,
      rowData: defaultRows,
    };
  },
  components: {
    InlineResultViewer,
    InlineResultsStatus,
  },
  created() {
    this.$store.commit('changeTitle', 'Validation List');
  },
});
</script>
