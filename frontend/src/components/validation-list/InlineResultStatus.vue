
<template>
  <div class="inline-result-status">
    <router-link :to="{ name: 'DetailsPage', params: { id: id } }">
      <span>{{ tableEntryObject }} </span>
      <Icon type="md-open" />
    </router-link>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { ResultDataInterface } from '@/interfaces/results';
import { TableEntryObjectInterface } from '@/interfaces/table';
import get from 'lodash/get';

export default Vue.extend({
  name: 'InlineResultStatus',
  props: {
    row: Object as () => ResultDataInterface,
    column: Object,
    index: Number,
  },
  computed: {
    tableEntryObject(): TableEntryObjectInterface {
      return get(this.row, this.column.path);
    },
    id(): string {
      return this.row.main.id;
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
