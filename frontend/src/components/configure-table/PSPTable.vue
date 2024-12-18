
<template>
  <div class="main-table">
    <div>
      <ConfigTableActionButtons
        :table-data="rowsData"
        @add-row="addRow"
        @reset-pathways="resetPathways"
      />
    </div>
    <Table
      :columns="columns"
      :data="rowsData"
      :loading="isLoading"
      ref="table"
      border
    >
      <template slot-scope="{ row, column, index }" slot="target-editor">
        <InlineTargetEdit
          :row="row"
          :column="column"
          :index="index"
          @changed="targetChanged"
          @set-editing="setEditing"
        />
      </template>
      <template slot-scope="{ row, column, index }" slot="string-editor">
        <InlineStringEdit
          :row="row"
          :column="column"
          :index="index"
          :rows-data="rowsData"
          @changed="dataChanged"
          @set-editing="setEditing"
          @set-error="setError"
        />
      </template>
      <template slot-scope="{ row, column, index }" slot="link-editor">
        <InlineLinkEdit
          :row="row"
          :column="column"
          :index="index"
          @changed="dataChanged"
        />
      </template>
      <template slot-scope="{ row, column, index }" slot="boolean-editor">
        <InlineBooleanEdit
          :row="row"
          :column="column"
          :index="index"
          @changed="dataChanged"
        />
      </template>
      <template slot-scope="{ row }" slot="actions">
        <Button
          type="warning"
          @click="removePathway(row.id)"
        >Delete</Button>
      </template>
    </Table>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import InlineStringEdit from '@/components/configure-table/InlineStringEdit.vue';
import InlineTargetEdit from '@/components/configure-table/InlineTargetEdit.vue';
import InlineLinkEdit from '@/components/configure-table/InlineLinkEdit.vue';
import InlineBooleanEdit from '@/components/configure-table/InlineBooleanEdit.vue';
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
    InlineLinkEdit,
    InlineBooleanEdit,
  },
  created() {
    this.restoreStoredData();
  },
  methods: {
    getDefaultRows() {
      return cloneDeep(defaultRows);
    },
    addRow(newRow: TableRowInterface) {
      this.rowsData.push(newRow);
    },
    dataChanged({ path, newValue }: ChangeTableCellEventInterface) {
      this.$set(get(this.rowsData, path), 'value', newValue);
    },
    targetChanged({ path, newTarget }: ChangeTableCellEventInterface) {
      const modifyingCell = get(this.rowsData, path);
      this.$set(modifyingCell, 'propertyValue', newTarget.propertyValue);
      this.$set(modifyingCell, 'targetName', newTarget.targetName);
      this.$set(modifyingCell, 'propertyDef', newTarget.propertyDef);
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
      const { circuitPath } = this.$store.getters;
      saveTableRowData(this.rowsData, circuitPath);
    },
    async restoreStoredData() {
      const { circuitPath: storedCircuitPath } = this.$store.getters;
      if (!storedCircuitPath) {
        const msg = 'There is no circuit selected';
        this.$Message.error(msg);
        throw new Error(msg);
      }
      const storedRowData = await getStoredTableRowData(storedCircuitPath);
      this.rowsData = storedRowData && storedRowData.length ? storedRowData : this.getDefaultRows();
      this.isLoading = false;
    },
    getDataToYamlFiles(): Array<string> {
      return getYamlFilesFromData(this.rowsData);
    },
    tableHasErrors() {
      return hasErrors(this.rowsData);
    },
    removePathway(pathwayId: string) {
      if (this.rowsData.length === 1) {
        this.$Message.error('At least one pathway should be configured');
        return;
      }
      const newPathways = this.rowsData.filter((pathway: TableRowInterface) => (pathway.id !== pathwayId));
      this.rowsData = newPathways;
    },
    resetPathways() {
      this.isLoading = true;
      this.rowsData = [];
      this.$nextTick(() => {
        this.rowsData = this.getDefaultRows();
        this.isLoading = false;
      });
    },
  },
});
</script>
