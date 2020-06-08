
<template>
  <div>
    <span
      :class="{'entry-with-errors': tableEntryObject.hasError}"
    >{{ tableEntryObject.value }}</span>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { TableEntryObjectInterface } from '@/interfaces/table';
import get from 'lodash/get';

export default Vue.extend({
  name: 'InlineResultViewer',
  props: {
    row: Object,
    column: Object,
    index: Number,
  },
  watch: {},
  data() {
    return {};
  },
  computed: {
    tableEntryObject(): TableEntryObjectInterface {
      return get(this.row, this.column.path);
    },
  },
  methods: {
  },
});
</script>


<style lang="scss" scoped>
.entry-with-errors {
  color: red;
}
</style>
