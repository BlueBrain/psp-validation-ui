
<template>
  <div
    class="inline-result-status"
    :style="{ 'color': color }"
  >
    <Icon
      class="status-icon"
      :type="statusIcon"
      :class="{ 'rotate': rotate }"
    />
    <span class="status-text">{{ tableEntryObject }}</span>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { MainTableInterface } from '@/interfaces/results';
import { jobStatus } from '@/constants/backend';

export default Vue.extend({
  name: 'InlineResultStatus',
  props: {
    row: Object as () => MainTableInterface,
  },
  computed: {
    tableEntryObject(): string {
      return this.row.status;
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
    rotate(): boolean {
      // is running / queued
      return !this.isOk && !this.isNotOk;
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

    &.rotate {
      animation: rotate 1.5s linear infinite;
    }
  }
  .status-text {
    vertical-align: middle;
  }

  @keyframes rotate {
    to{ transform: rotate(360deg); }
  }
}
</style>
