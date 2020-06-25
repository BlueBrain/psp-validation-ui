
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
import Vue, { PropType } from 'vue';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import {
  TableEntryObjectInterface,
  CheckResultInterface,
  TableColumnInterface,
  TableRowInterface,
  ChangeTableCellEventInterface,
  EditingObject,
  StoreStateInterface,
} from '@/interfaces/table';
import { checkStringByRule } from '@/helpers/inline-table-helper';


export default Vue.extend({
  name: 'InlineStringEdit',
  props: {
    row: Object as PropType<TableRowInterface>,
    column: Object as PropType<TableColumnInterface>,
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
    storedElem(): StoreStateInterface {
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
        rules: this.column.rules,
      } as EditingObject);

      this.$emit('set-editing', {
        path: `[${this.index}].${this.column.path}`,
        newValue: true,
      } as ChangeTableCellEventInterface);
    },
    doneChanging(newValue: string) {
      // use the stored value if available
      const indexToChange = isNil(this.storedElem.currentlyEditingRowIndex) ? this.index : this.storedElem.currentlyEditingRowIndex;
      const pathToChange = isNil(this.storedElem.currentlyEditingPath) ? this.column.path : this.storedElem.currentlyEditingPath;
      const rulesToCheck = isNil(this.storedElem.currentlyEditingPath) ? this.column.rules : this.storedElem.currentlyEditingRules;
      const fullPathWithRowIndex = `[${indexToChange}].${pathToChange}`;

      const valueToCommit = (newValue === '') ? 'None' : newValue;

      this.$emit('changed', {
        path: fullPathWithRowIndex,
        newValue: valueToCommit,
      } as ChangeTableCellEventInterface);

      this.$emit('set-editing', {
        path: fullPathWithRowIndex,
        newValue: false,
      } as ChangeTableCellEventInterface);

      const result: CheckResultInterface = checkStringByRule(valueToCommit, rulesToCheck);
      this.$emit('set-error', {
        path: fullPathWithRowIndex,
        newValue: result.hasError,
        message: result.message,
      } as ChangeTableCellEventInterface);

      // reset the editing element in store
      this.$store.commit('setCurrentEditObj', {});
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
