
<template>
  <div>
    <Checkbox
      :value="localValue"
      @on-change="changed"
    />
  </div>
</template>


<script lang="ts">
import Vue, { PropType } from 'vue';
import get from 'lodash/get';
import {
  TableRowInterface,
  TableColumnInterface,
} from '@/interfaces/table';

export default Vue.extend({
  name: 'InlineBooleanEdit',
  props: {
    row: Object as PropType<TableRowInterface>,
    column: Object as PropType<TableColumnInterface>,
    index: Number,
  },
  computed: {
    localValue() {
      return get(this.row, this.column.path).value;
    },
  },
  methods: {
    changed(newValue: boolean) {
      this.$emit('changed', {
        path: `[${this.index}].${this.column.path}`,
        newValue,
      });
    },
  },
});
</script>
