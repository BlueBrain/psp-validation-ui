
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
      >{{ tableEntryObject.value || emptyCharacter }}</span>
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
import { checkStringByRule, emptyCharacter } from '@/helpers/inline-table-helper';
import { getPathByKey } from '@/default-data/default-columns';


export default Vue.extend({
  name: 'InlineStringEdit',
  props: {
    row: Object as PropType<TableRowInterface>,
    column: Object as PropType<TableColumnInterface>,
    index: Number,
    rowsData: Array as PropType<Array<TableRowInterface>>,
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
      emptyCharacter,
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

      const valueToCommit = (newValue === '') ? emptyCharacter : newValue;

      this.$emit('changed', {
        path: fullPathWithRowIndex,
        newValue: valueToCommit,
      } as ChangeTableCellEventInterface);

      this.$emit('set-editing', {
        path: fullPathWithRowIndex,
        newValue: false,
      } as ChangeTableCellEventInterface);

      const result: CheckResultInterface = checkStringByRule(valueToCommit, rulesToCheck);
      // TODO: change this emitError to emitMessage or refreshField
      // because even if it has not error it will refresh the color in value
      this.emitError(fullPathWithRowIndex, result.hasError, result.message);

      // reset the editing element in store
      this.$store.commit('setCurrentEditObj', {});

      this.checkNumberSynapses(fullPathWithRowIndex);
    },
    checkNumberSynapses(path: string) {
      // TODO: use constants instead of string
      if (!path.includes('minNumSyn') && !path.includes('maxNumSyn')) return;

      if (!path) this.$Message.error('[checkNumberSynapses] path error');

      // path contains the index that was modified e.g. "[1].pathway.constraints.maxNumSyn"
      const matches = path.match('\\[(.+)\\]');
      const index = (matches && matches.length) ? matches[1] : null;
      if (!index) this.$Message.error('[checkNumberSynapses] path index error');

      const isMinNumSyn = path.includes('minNumSyn');
      const rulesToCheck = this.column.rules;
      const pathMin = `[${index}].${getPathByKey('minNumSyn')}`;
      const pathMax = `[${index}].${getPathByKey('maxNumSyn')}`;
      const minSynStr = get(this.rowsData, `${pathMin}.value`);
      const maxSynStr = get(this.rowsData, `${pathMax}.value`);

      // avoid checking if not defined. Psp backend will take care
      if (minSynStr === emptyCharacter || maxSynStr === emptyCharacter) return;

      const checkResultMin: CheckResultInterface = checkStringByRule(minSynStr, rulesToCheck);
      if (checkResultMin.hasError) {
        this.emitError(pathMin, checkResultMin.hasError, checkResultMin.message);
        return;
      }

      const checkResultMax: CheckResultInterface = checkStringByRule(maxSynStr, rulesToCheck);
      if (checkResultMax.hasError) {
        this.emitError(pathMax, checkResultMax.hasError, checkResultMax.message);
        return;
      }

      // after checking that each value fulfil the rules, process comparing them

      const hasError = (parseInt(maxSynStr, 10) < parseInt(minSynStr, 10));

      if (!hasError) {
        // reset error style in min and max
        this.emitError(pathMin, hasError, '');
        this.emitError(pathMax, hasError, '');
        return;
      }

      if (isMinNumSyn) {
        this.emitError(path, hasError, 'Min number of synapse higher than max number of synapse');
      } else {
        this.emitError(path, hasError, 'Max number of synapse lower than min number of synapse');
      }
    },
    emitError(path: string, newValue: boolean, message: string) {
      this.$emit('set-error', {
        path,
        newValue,
        message,
      } as ChangeTableCellEventInterface);
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
