
<template>
  <div
    class="inline-result-status"
    :style="{ 'color': color }"
  >
    <Icon class="status-icon" :type="statusIcon" />
    <span class="status-text">{{ tableEntryObject }}</span>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { ResultDataInterface } from '@/interfaces/results';
import { jobStatus } from '@/constants/backend';
import get from 'lodash/get';

export default Vue.extend({
  name: 'InlineResultStatus',
  props: {
    row: Object as () => ResultDataInterface,
    column: Object,
    index: Number,
  },
  computed: {
    tableEntryObject(): string {
      return get(this.row, this.column.path);
    },
    isOk(): boolean {
      return this.tableEntryObject === jobStatus.SUCCESSFUL;
    },
    isNotOk(): boolean {
      return this.tableEntryObject === jobStatus.FAILED
        || this.tableEntryObject === jobStatus.ERROR;
    },
    statusIcon(): string {
      if (this.isOk) return 'ios-checkmark-circle';
      if (this.isNotOk) return 'ios-close-circle';
      return 'ios-loading';
    },
    color(): string {
      if (this.isOk) return '#187';
      if (this.isNotOk) return '#ff6601';
      return '#515a6e';
    },
  },

});
</script>


<style lang="scss" scoped>
.inline-result-status {
  text-align: left;
  width: 120px;
  margin: 0 auto;

  .status-icon {
    margin-right: 5px;
    font-size: 25px;
    vertical-align: middle;
  }
  .status-text {
    vertical-align: middle;
  }
}
</style>
