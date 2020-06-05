
<template>
  <div>
    <Input
      v-model="localValue"
      v-show="tableEntryObject.isEditing"
      @on-enter="enterPressed"
      @on-blur="stopEditing"
    />

    <div
      v-show="!tableEntryObject.isEditing"
      @click="toggleInput"
    >
      <span
        :class="{'entry-with-errors': tableEntryObject.hasError}"
        :title="tableEntryObject.message"
      >{{ tableEntryObject.value || 'None' }}</span>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { TableEntryObjectInterface, CheckResultInterface } from '@/interfaces/table';
import { EditingObject, TableStateInterface } from '@/interfaces/store';
import { checkStringByRule } from '@/helpers/inline-table-helpers';


export default Vue.extend({
  name: 'InlineStringEdit',
  props: {
    row: Object,
    column: Object,
    index: Number,
  },
  watch: {
    localValue(newValue: string) {
      if (!this.$store.state.tableEditingModule.currentlyEditingPath) return;
      this.$store.commit('modifyStoredValue', newValue);
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
    storedElem(): TableStateInterface {
      return this.$store.state.tableEditingModule;
    },
  },
  methods: {
    toggleInput() {
      if (this.storedElem.currentlyEditingPath) {
        // an element was edited but not saved yet. Save it
        this.doneChanging(this.storedElem.currentlyEditingValue);
      }

      this.$store.commit('setCurrentEditObj', {
        rowIndex: this.index,
        path: this.column.path,
        value: this.localValue,
      } as EditingObject);

      this.$emit('setEditing', {
        path: `[${this.index}].${this.column.path}`,
        newValue: true,
      });
    },
    doneChanging(newValue: string) {
      // use the stored value if available
      const indexToChange = isNil(this.storedElem.currentlyEditingRowIndex) ? this.index : this.storedElem.currentlyEditingRowIndex;
      const pathToChange = isNil(this.storedElem.currentlyEditingPath) ? this.column.path : this.storedElem.currentlyEditingPath;
      const fullPathWithRowIndex = `[${indexToChange}].${pathToChange}`;

      this.$emit('changed', {
        path: fullPathWithRowIndex,
        newValue,
      });

      this.$emit('setEditing', {
        path: fullPathWithRowIndex,
        newValue: false,
      });

      const result: CheckResultInterface = checkStringByRule(newValue, this.column.rules);
      this.$emit('setError', {
        path: fullPathWithRowIndex,
        newValue: result.hasError,
        message: result.message,
      });

      // reset the editing element in store
      this.$store.commit('setCurrentEditObj', {} as EditingObject);
    },
    enterPressed() {
      this.doneChanging(this.localValue);
    },
    stopEditing() {
      if (!this.storedElem.currentlyEditingPath) {
        return;
      }
      this.doneChanging(this.storedElem.currentlyEditingValue);
    },
  },
});
</script>


<style lang="scss" scoped>
.entry-with-errors {
  color: red;
}
</style>
