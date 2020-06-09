
<template>
  <div class="inline-result-status">
    <router-link :to="{ name: 'DetailsPage', params: { tableEntryObject: tableEntryObject }}">
      <span>{{ tableEntryObject.value }} </span>
      <Icon type="md-open" />
    </router-link>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { TableEntryObjectInterface } from '@/interfaces/table';
import get from 'lodash/get';

export default Vue.extend({
  name: 'InlineResultStatus',
  props: {
    row: Object,
    column: Object,
    index: Number,
  },
  computed: {
    tableEntryObject(): TableEntryObjectInterface {
      return get(this.row, this.column.path);
    },
  },
});
</script>


<style lang="scss" scoped>
.inline-result-status {
  a {
    text-decoration: none;
    color: inherit;
  }
}
</style>
