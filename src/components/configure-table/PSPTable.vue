
<template>
  <div class="main-table">
    <Table
      :columns="columns"
      :data="rowData"
      ref="table"
      border
    >
      <template slot-scope="{ row, column, index }" slot="string-editor">
        <InlineStringEdit
          :row="row"
          :column="column"
          :index="index"
          @changed="dataChanged"
          @setEditing="setEditing"
        />
      </template>

      <template slot-scope="{ row, column, index }" slot="target-editor">
        <InlineTargetEdit
          :row="row"
          :column="column"
          :index="index"
          @changed="targetChanged"
          @setEditing="setEditing"
        />
      </template>
    </Table>

    <!-- <Button @click="retrieveFullObject">Continue</Button> -->

  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import get from 'lodash/get';
import InlineStringEdit from '@/components/configure-table/InlineStringEdit.vue';
import InlineTargetEdit from '@/components/configure-table/InlineTargetEdit.vue';
import defaultColumns from '@/default-data/default-columns';
import defaultRows from '@/default-data/default-rows';
import { Target } from '@/interfaces/table';


export default Vue.extend({
  name: 'PSPTable',
  data() {
    return {
      columns: defaultColumns,
      rowData: defaultRows,
    };
  },
  components: {
    InlineStringEdit,
    InlineTargetEdit,
  },
  methods: {
    retrieveFullObject() {
      console.debug(this.rowData);
      this.$Modal.confirm({
        title: 'Table Data',
        content: JSON.stringify(this.rowData, null, 2),
      });
    },
    dataChanged({ path, newValue }: { path: string; newValue: string }) {
      this.$set(get(this.rowData, path), 'value', newValue);
    },
    targetChanged({ path, newTarget }: { path: string; newTarget: Target }) {
      this.$set(get(this.rowData, path), 'value', newTarget.value);
      this.$set(get(this.rowData, path), 'name', newTarget.name);
      this.$set(get(this.rowData, path), 'query', newTarget.query);
    },
    setEditing({ path, newValue }: { path: string; newValue: boolean }) {
      this.$set(get(this.rowData, path), 'isEditing', newValue);
    },
  },
});
</script>
