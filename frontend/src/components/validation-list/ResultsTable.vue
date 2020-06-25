
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
import defaultColumns from '@/default-data/results-columns';
import InlineResultViewer from '@/components/validation-list/InlineResultViewer.vue';
import InlineResultsStatus from '@/components/validation-list/InlineResultStatus.vue';
import {
  ValidationsExpanded,
  MainTableInterface,
  ResultDataInterface,
} from '@/interfaces/results';

export default Vue.extend({
  name: 'ResultsTable',
  props: {
    isLoading: Boolean,
    validations: Array as () => Array<ValidationsExpanded>,
  },
  data() {
    return {
      columns: defaultColumns,
      rowData: [] as Array<ResultDataInterface>,
    };
  },
  components: {
    InlineResultViewer,
    InlineResultsStatus,
  },
  watch: {
    validations(newVal: Array<ValidationsExpanded>) {
      if (!newVal.length) return;
      this.processData();
    },
  },
  methods: {
    processData() {
      const dataToRender: Array<ResultDataInterface> = [];
      this.validations.forEach((validationResult: ValidationsExpanded) => {
        const job = validationResult.jobInfo;
        const mainTableResults: MainTableInterface = {
          name: job.name,
          status: job.status,
          date: new Date(job.submissionTime).toLocaleString(),
          location: validationResult.physicalLocation,
          id: validationResult.id,
        };

        dataToRender.push({
          main: mainTableResults,
        });
      });
      this.rowData = dataToRender;
    },
  },
});
</script>
