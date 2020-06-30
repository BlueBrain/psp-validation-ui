
<template>
  <div>
    <Modal
      v-model="tableEntryObject.isEditing"
      title="Edit Target"
      @on-cancel="cancelClicked"
    >
      <Row>
        <!-- use i-col to avoid linting error -->
        <i-col :span="columnSize">Property definition</i-col>
        <i-col :span="columnSize">Value</i-col>
        <i-col :span="columnSize">Name</i-col>
      </Row>
      <Row>
        <i-col :span="columnSize">
          <Select v-model="localPropDef">
            <Option :value="targetQuery.M_TYPE">MType</Option>
            <Option :value="targetQuery.SYNAPSE_CLASS">SynapseClass</Option>
          </Select>
        </i-col>
        <i-col :span="columnSize">
          <Select
            v-if="localPropDef === targetQuery.M_TYPE"
            v-model="localPropValue"
          >
            <Option
              v-for="mType in circuitMTypes"
              :key="mType.name"
              :value="mType.name"
            >{{mType.displayName || mType.name}}</Option>
          </Select>

          <Select
            v-if="localPropDef === targetQuery.SYNAPSE_CLASS"
            v-model="localPropValue"
          >
            <Option value="INH">INH</Option>
            <Option value="EXC">EXC</Option>
          </Select>
        </i-col>
        <i-col :span="columnSize">
          <Input v-model="localTargetName" />
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="cancelClicked">Cancel</Button>
        <Button
          type="info"
          :disabled="!areFieldsComplete"
          @click="saveTargetChanges"
        >Save</Button>
      </div>
    </Modal>

    <div
      v-show="!tableEntryObject.isEditing"
      @click="openTargetEditModal"
    >
      <span>{{ tableEntryObject.targetName }}</span>
    </div>
  </div>
</template>


<script lang="ts">
import Vue, { PropType } from 'vue';
import get from 'lodash/get';
import snakeCase from 'lodash/snakeCase';
import isNil from 'lodash/isNil';
import {
  Target,
  ChangeTableCellEventInterface,
  TableRowInterface,
  TableColumnInterface,
  EditingObject,
  StoreStateInterface,
} from '@/interfaces/table';
import { circuitMTypes, targetQuery } from '@/constants/target-types';

const columnSize = 8;

export default Vue.extend({
  name: 'InlineTargetEdit',
  props: {
    row: Object as PropType<TableRowInterface>,
    column: Object as PropType<TableColumnInterface>,
    index: Number,
  },
  watch: {
    localPropDef() {
      this.localTargetName = '';
    },
    localPropValue() {
      if (this.localPropValue && this.localPropDef) {
        let newName = snakeCase(this.localPropDef).toUpperCase();
        newName = `${newName}:${this.localPropValue}`;
        this.localTargetName = newName;
      }
    },
  },
  data() {
    return {
      localPropDef: '',
      localPropValue: '',
      localTargetName: '',
      circuitMTypes,
      targetQuery,
      columnSize,
    };
  },
  computed: {
    tableEntryObject(): Target {
      return get(this.row, this.column.path);
    },
    areFieldsComplete(): boolean {
      return !!(this.localTargetName && this.localPropValue && this.localPropDef);
    },
    storedElem(): StoreStateInterface {
      return this.$store.state.tableEditingModule;
    },
  },
  created() {
    this.resetTarget();
  },
  methods: {
    saveTargetChanges() {
      const targetObj = {
        propertyDef: this.localPropDef,
        propertyValue: this.localPropValue,
        targetName: this.localTargetName,
      };
      this.doneChanging(targetObj);
    },
    openTargetEditModal() {
      if (this.storedElem.currentlyEditingPath) {
        // an element was edited but not saved yet. Save it
        this.doneChanging(this.storedElem.currentlyEditingTarget);
      }

      const targetObj = {
        propertyDef: this.localPropDef,
        propertyValue: this.localPropValue,
        targetName: this.localTargetName,
      };

      this.$store.commit('setCurrentEditObj', {
        rowIndex: this.index,
        path: this.column.path,
        target: targetObj,
      } as EditingObject);

      this.$emit('set-editing', {
        path: `[${this.index}].${this.column.path}`,
        newValue: true,
      } as ChangeTableCellEventInterface);
    },
    doneChanging(newTarget: Target) {
      this.$emit('changed', {
        path: `[${this.index}].${this.column.path}`,
        newTarget,
      } as ChangeTableCellEventInterface);
      console.debug('NEED TO CHECK IF CORRECT');
      this.endEditing();
    },
    endEditing() {
      // use the stored value if available
      const indexToChange = isNil(this.storedElem.currentlyEditingRowIndex) ? this.index : this.storedElem.currentlyEditingRowIndex;
      const pathToChange = isNil(this.storedElem.currentlyEditingPath) ? this.column.path : this.storedElem.currentlyEditingPath;

      this.$emit('set-editing', {
        path: `[${indexToChange}].${pathToChange}`,
        newValue: false,
      } as ChangeTableCellEventInterface);

      // reset the editing element in store
      this.$store.commit('setCurrentEditObj', {} as EditingObject);
    },
    cancelClicked() {
      this.endEditing();
      this.resetTarget();
    },
    resetTarget() {
      const { targetName, propertyDef, propertyValue } = this.tableEntryObject;
      this.localPropDef = propertyDef;
      this.localPropValue = propertyValue;
      this.localTargetName = targetName;
    },
  },
});
</script>
