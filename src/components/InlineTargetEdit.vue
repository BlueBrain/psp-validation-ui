
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
import { Target } from '@/interfaces/table';
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
  },
  created() {
    this.localTarget = this.resetTarget();
  },
  methods: {
    saveTargetChanges() {
      this.doneChanging(this.localTarget);
    },
    openTargetEditModal() {
      const storedElem = this.$store.state.tableEditingModule;
      if (storedElem.currentlyEditingColumn) {
        // an element was edited but not saved yet. Save it
        this.doneChanging(storedElem.currentlyEditingValue);
      }

      this.$store.commit('setCurrentEditObj', {
        row: this.row,
        column: this.column,
        value: this.localTarget,
      });
      this.$set(get(this.row, this.column.path), 'isEditing', true);
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
      const storedElem = this.$store.state.tableEditingModule;
      const storeObject = get(storedElem.currentlyEditingRow, storedElem.currentlyEditingColumn.path);
      this.$set(storeObject, 'isEditing', false);
      this.$store.commit('setCurrentEditObj', {}); // reset the editing element in store
    },
    cancelClicked() {
      console.log('cancelClicked');
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
