
<template>
  <div>
    <Modal
      v-model="tableEntryObject.isEditing"
      title="Edit Target"
      @on-cancel="cancelClicked"
    >
      <Row>
        <!-- use i-col to avoid linting error -->
        <i-col :span="columnSize">Name</i-col>
        <i-col :span="columnSize">Query Definition</i-col>
        <i-col :span="columnSize">Value</i-col>
      </Row>
      <Row>
        <i-col :span="columnSize">
          <Input v-model="localTarget.name" />
        </i-col>
        <i-col :span="columnSize">
          <Select v-model="localTarget.query">
            <Option :value="targetQuery.M_TYPE">MType</Option>
            <Option :value="targetQuery.SYNAPSE_CLASS">SynapseClass</Option>
          </Select>
        </i-col>
        <i-col :span="columnSize">
          <Select
            v-if="localTarget.query === targetQuery.M_TYPE"
            v-model="localTarget.value"
          >
            <Option
              v-for="mType in circuitMTypes"
              :key="mType.name"
              :value="mType.name"
            >{{mType.displayName || mType.name}}</Option>
          </Select>

          <Select
            v-if="localTarget.query === targetQuery.SYNAPSE_CLASS"
            v-model="localTarget.value"
          >
            <Option value="INH">INH</Option>
            <Option value="EXC">EXC</Option>
          </Select>
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
      <span
        :class="{'entry-with-errors': tableEntryObject.hasError}"
      >{{ tableEntryObject.name }}</span>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { Target } from '@/interfaces/table';
import { EditingObject, TableStateInterface } from '@/interfaces/store';
import { circuitMTypes, targetQuery } from '@/constants/target-types';

const columnSize = 8;

export default Vue.extend({
  name: 'InlineTargetEdit',
  props: {
    row: Object,
    column: Object,
    index: Number,
  },
  data() {
    return {
      localTarget: {} as Target, // will be filled on created
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
      return !!(this.localTarget.name && this.localTarget.value && this.localTarget.query);
    },
    storedElem(): TableStateInterface {
      return this.$store.state.tableEditingModule;
    },
  },
  created() {
    this.localTarget = this.resetTarget();
  },
  methods: {
    saveTargetChanges() {
      this.doneChanging(this.localTarget);
    },
    openTargetEditModal() {
      if (this.storedElem.currentlyEditingPath) {
        // an element was edited but not saved yet. Save it
        this.doneChanging(this.storedElem.currentlyEditingTarget);
      }

      this.$store.commit('setCurrentEditObj', {
        rowIndex: this.index,
        path: this.column.path,
        target: this.localTarget,
      } as EditingObject);

      this.$emit('setEditing', {
        path: `[${this.index}].${this.column.path}`,
        newValue: true,
      });
    },
    doneChanging(newTarget: Target) {
      this.$emit('changed', {
        path: `[${this.index}].${this.column.path}`,
        newTarget,
      });
      console.debug('NEED TO CHECK IF CORRECT');
      this.endEditing();
    },
    endEditing() {
      // use the stored value if available
      const indexToChange = isNil(this.storedElem.currentlyEditingRowIndex) ? this.index : this.storedElem.currentlyEditingRowIndex;
      const pathToChange = isNil(this.storedElem.currentlyEditingPath) ? this.column.path : this.storedElem.currentlyEditingPath;

      this.$emit('setEditing', {
        path: `[${indexToChange}].${pathToChange}`,
        newValue: false,
      });

      // reset the editing element in store
      this.$store.commit('setCurrentEditObj', {} as EditingObject);
    },
    cancelClicked() {
      this.endEditing();
      this.localTarget = this.resetTarget();
    },
    resetTarget(): Target {
      const { name, query, value } = this.tableEntryObject;
      const localTarget = { name, query, value };
      return localTarget;
    },
  },
});
</script>
