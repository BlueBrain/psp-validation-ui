
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
import InlineResultViewer from '@/components/validation-list/InlineResultViewer.vue';
import InlineResultsStatus from '@/components/validation-list/InlineResultStatus.vue';
import {
  ValidationsWithFiles,
  MainTableInterface,
  ResultDataInterface,
} from '@/interfaces/results';
import { DataToUpload } from '@/interfaces/unicore';
import { transformYamlToObj } from '@/helpers/results-list';
import { RowToYamlInterface } from '@/interfaces/table';

export default Vue.extend({
  name: 'ResultsTable',
  props: {
    isLoading: Boolean,
    validations: Array as () => Array<ValidationsWithFiles>,

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
    validations(newVal: Array<ValidationsWithFiles>) {
      if (!newVal.length) return;
      this.processData();
    },
  },
  methods: {
    processData() {
      const dataToRender: Array<ResultDataInterface> = [];
      // TODO fix this any
      this.validations.forEach((validationResult: ValidationsWithFiles) => {
        const yamlFiles = validationResult.files;
        const expandedInfoObj: Array<RowToYamlInterface> = yamlFiles
          .map((yaml: DataToUpload): RowToYamlInterface => {
            const pathwayObj = transformYamlToObj(yaml.Data);
            return pathwayObj;
          });

        const job = validationResult.jobInfo;
        const mainTableResults: MainTableInterface = {
          name: job.name,
          status: job.status,
          date: new Date(job.submissionTime).toLocaleString(),
        };

        dataToRender.push({
          main: mainTableResults,
          expanded: expandedInfoObj,
        });
      });
      this.rowData = dataToRender;
    },
  },
});
</script>
