
<template>
  <div class="config-table-acction-buttons">
    <div class="action-table-buttons-container">
      <Button
        @click="resetPathways"
        type="primary"
        ghost
      >
        <Icon type="md-undo"/>
        Reset Patways
      </Button>
      <Button
        @click="exportRowsData"
        type="primary"
        ghost
      >
        <Icon type="md-download" />
        Export Data
      </Button>
      <Button
        type="primary"
        ghost
        @click="addNewRow"
      >
        <Icon type="md-add" />
        Add
      </Button>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import last from 'lodash/last';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuidv4 } from 'uuid';
import { TableRowInterface } from '@/interfaces/table';
import { exportRowsToZip } from '@/helpers/yaml-helper';

export default Vue.extend({
  name: 'ConfigTableActionButtons',
  props: {
    tableData: Array as () => Array<TableRowInterface>,
  },
  methods: {
    exportRowsData() {
      exportRowsToZip(this.tableData);
    },
    addNewRow() {
      const lastEntry: TableRowInterface | undefined = last(this.tableData);
      if (!lastEntry) return;

      const newRow = cloneDeep(lastEntry);
      newRow.id = uuidv4();
      this.$emit('add-row', newRow);
    },
    resetPathways() {
      this.$emit('reset-pathways');
    },
  },
});
</script>


<style lang="scss" scoped>
.config-table-acction-buttons .action-table-buttons-container {
  display: flex;
  justify-content: flex-end;
  margin: 10px;

  button {
    margin-left: 5px;
  }
}
</style>
