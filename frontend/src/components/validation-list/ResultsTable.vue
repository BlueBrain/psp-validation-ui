
<template>
  <div class="results-table">
    <Table
      :columns="columns"
      :data="rowData"
      :loading="isLoading"
      @on-row-click="showDetails"
      ref="table"
      border
    >
      <template slot-scope="{ row }" slot="date-viewer">
        {{ displayDate(row.date) }}
      </template>

      <template slot-scope="{ row }" slot="status-slot">
        <InlineResultsStatus :row="row" />
      </template>
    </Table>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import upperFirst from 'lodash/upperFirst';
import defaultColumns from '@/default-data/results-columns';
import InlineResultsStatus from '@/components/validation-list/InlineResultStatus.vue';
import {
  ValidationsExpanded,
  MainTableInterface,
} from '@/interfaces/results';
import { getFinalStatus } from '@/helpers/backend-helper';

export default Vue.extend({
  name: 'ResultsTable',
  props: {
    isLoading: Boolean,
    validations: Array as () => Array<ValidationsExpanded>,
  },
  data() {
    return {
      columns: defaultColumns,
      rowData: [] as Array<MainTableInterface>,
    };
  },
  components: {
    InlineResultsStatus,
  },
  watch: {
    validations(newVal: Array<ValidationsExpanded>) {
      this.rowData = [];
      if (!newVal.length) return;
      this.processData();
    },
  },
  methods: {
    processData() {
      const dataToRender: Array<MainTableInterface> = [];
      this.validations.forEach((validationResult: ValidationsExpanded) => {
        const job = validationResult.jobInfo;

        const mainTableResults: MainTableInterface = {
          name: upperFirst(job.name),
          status: getFinalStatus(job),
          date: job.submissionTime,
          id: validationResult.id,
        };

        dataToRender.push(mainTableResults);
      });
      this.rowData = dataToRender;
    },
    showDetails(row: MainTableInterface) {
      this.$router.push({
        name: 'DetailsPage',
        params: { id: row.id },
      });
    },
    displayDate(dateStr: string): string {
      return (new Date(dateStr)).toLocaleString();
    },
  },
});
</script>
