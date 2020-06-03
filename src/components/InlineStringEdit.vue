
<template>
  <div>
    <Input
      v-model="localValue"
      v-show="tableEntryObject.isEditing"
      @on-enter="enterPressed"
    />

    <div
      v-show="!tableEntryObject.isEditing"
      @click="toggleInput"
    >
      <span
        :class="{'entry-with-errors': tableEntryObject.hasError}"
      >{{ tableEntryObject.value }}</span>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { TableEntryObjectInterface } from '@/interfaces/table';
import get from 'lodash/get';

export default Vue.extend({
  name: 'InlineStringEdit',
  props: {
    row: Object,
    column: Object,
    index: Number,
  },
  watch: {
    localValue(newValue: string) {
      if (!this.$store.state.tableEditingModule.currentlyEditingValue) return;
      this.$store.commit('modifyCurrentValue', newValue);
    },
  },
  data() {
    return {
      localValue: get(this.row, this.column.path).value,
    };
  },
  computed: {
    tableEntryObject(): TableEntryObjectInterface {
      return get(this.row, this.column.path);
    },
  },
  methods: {
    toggleInput() {
      const storedElem = this.$store.state.tableEditingModule;
      if (storedElem.currentlyEditingColumn) {
        // an element was edited but not saved yet. Save it
        this.doneChanging(storedElem.currentlyEditingValue);
      }

      this.$store.commit('setCurrentEditObj', {
        row: this.row,
        column: this.column,
        value: this.localValue,
      });
      this.$set(get(this.row, this.column.path), 'isEditing', true);
    },
    doneChanging(newValue: string) {
      this.$emit('changed', {
        path: `[${this.index}].${this.column.path}`,
        newValue,
      });
      console.debug('NEED TO CHECK IF CORRECT');
      const storedElem = this.$store.state.tableEditingModule;
      const storeObject = get(storedElem.currentlyEditingRow, storedElem.currentlyEditingColumn.path);
      this.$set(storeObject, 'isEditing', false);
      this.$store.commit('setCurrentEditObj', {}); // reset the editing element in store
    },
    enterPressed() {
      this.doneChanging(this.localValue);
    },
  },
});
</script>


<style lang="scss" scoped>
.entry-with-errors {
  color: red;
}
</style>
