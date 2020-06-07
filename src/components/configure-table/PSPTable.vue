
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
import { ChangeTableCellEventInterface, TableRowInterface } from '@/interfaces/table';
import ConfigTableActionButtons from '@/components/configure-table/ConfigTableActionButtons.vue';

export default Vue.extend({
  name: 'PSPTable',
  data() {
    return {
      columns: defaultColumns,
      rowsData: defaultRows,
    };
  },
  components: {
    InlineStringEdit,
    InlineTargetEdit,
    ConfigTableActionButtons,
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
  },
});
</script>
