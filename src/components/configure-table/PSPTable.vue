
<template>
  <div class="main-table">
    <div>
      <ConfigTableActionButtons
        :table-data="rowsData"
        @add-row="addRow"
      />
    </div>
    <Table
      :columns="columns"
      :data="rowsData"
      :loading="isLoading"
      ref="table"
      border
    >
      <template slot-scope="{ row, column, index }" slot="string-editor">
        <InlineStringEdit
          :row="row"
          :column="column"
          :index="index"
          @changed="dataChanged"
          @set-editing="setEditing"
          @set-error="setError"
        />
      </template>

      <template slot-scope="{ row, column, index }" slot="target-editor">
        <InlineTargetEdit
          :row="row"
          :column="column"
          :index="index"
          @changed="targetChanged"
          @set-editing="setEditing"
        />
      </template>
    </Table>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import get from 'lodash/get';
import InlineStringEdit from '@/components/configure-table/InlineStringEdit.vue';
import InlineTargetEdit from '@/components/configure-table/InlineTargetEdit.vue';
import defaultColumns from '@/default-data/default-columns';
import defaultRows from '@/default-data/default-rows';
import { ChangeTableCellEventInterface, TableRowInterface, TableColumnInterface } from '@/interfaces/table';
import ConfigTableActionButtons from '@/components/configure-table/ConfigTableActionButtons.vue';
import { saveTableRowData, getStoredTableRowData } from '@/helpers/db';
import { getYamlFilesFromData } from '@/helpers/yaml-helper';
import { hasErrors } from '@/helpers/inline-table-helper';

export default Vue.extend({
  name: 'PSPTable',
  data() {
    return {
      columns: defaultColumns as Array<TableColumnInterface>,
      rowsData: [] as Array<TableRowInterface>,
      isLoading: true,
    };
  },
  components: {
    InlineStringEdit,
    InlineTargetEdit,
    ConfigTableActionButtons,
  },
  created() {
    this.restoreStoredData();
  },
  methods: {
    addRow(newRow: TableRowInterface) {
      this.rowsData.push(newRow);
    },
    dataChanged({ path, newValue }: ChangeTableCellEventInterface) {
      this.$set(get(this.rowsData, path), 'value', newValue);
    },
    targetChanged({ path, newTarget }: ChangeTableCellEventInterface) {
      const modifyingCell = get(this.rowsData, path);
      this.$set(modifyingCell, 'value', newTarget.value);
      this.$set(modifyingCell, 'name', newTarget.name);
      this.$set(modifyingCell, 'query', newTarget.query);
    },
    setEditing({ path, newValue }: ChangeTableCellEventInterface) {
      this.$set(get(this.rowsData, path), 'isEditing', newValue);
    },
    setError({ path, newValue, message }: ChangeTableCellEventInterface) {
      const modifyingCell = get(this.rowsData, path);
      this.$set(modifyingCell, 'hasError', newValue);
      this.$set(modifyingCell, 'message', message);
    },
    saveToDB() {
      const { circuitPath } = this.$store.state.generalParamsModule;
      saveTableRowData(this.rowsData, circuitPath);
    },
    async restoreStoredData() {
      const { circuitPath: storedCircuitPath } = this.$store.state.generalParamsModule;
      if (!storedCircuitPath) {
        const msg = 'There is no circuit selected';
        this.$Message.error(msg);
        throw new Error(msg);
      }
      const storedRowData = await getStoredTableRowData(storedCircuitPath);
      this.rowsData = storedRowData.length ? storedRowData : defaultRows;
      this.isLoading = false;
    },
    getDataToYamlFiles(): Array<string> {
      return getYamlFilesFromData(this.rowsData);
    },
    tableHasErrors() {
      return hasErrors(this.rowsData);
    },
  },
});
</script>
