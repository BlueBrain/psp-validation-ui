
<template>
  <div class="circuit-selection">
    <Select
      :value="currentCircuit.name"
      @on-change="newCircuitNameSelected"
    >
      <Option
        v-for="circuit in circuitList"
        :key="circuit.name"
        :value="circuit.name"
        :label="circuit.displayName"
      >
        <span>{{ circuit.name }}</span>
        <span class="circuit-path-in-option">({{ circuit.path }})</span>
        <Button
          @click="removeCircuit(circuit.name, $event)"
          class="remove-circuit"
          type="error"
          size="small"
          ghost
        >
          <Icon type="md-trash" />
        </Button>
      </Option>
    </Select>
    <Button @click="addNewCircuit" icon="md-add">New</Button>

    <Modal
      v-model="isEditing"
      title="Edit Circuit"
      @on-cancel="cancelClicked"
    >
      <Row type="flex" justify="center" align="middle">
        <!-- use i-col to avoid linting error -->
        <i-col :span="labelSize">Display Name</i-col>
        <i-col :span="contentSize">
          <Input v-model="newEditingCircuit.displayName"/>
        </i-col>
      </Row>
      <Row type="flex" justify="center" align="middle">
        <i-col :span="labelSize">Name</i-col>
        <i-col :span="contentSize">
          <Input v-model="newEditingCircuit.name"/>
        </i-col>
      </Row>
      <Row type="flex" justify="center" align="middle">
        <i-col :span="labelSize">CircuitConfig Path</i-col>
        <i-col :span="contentSize">
          <Input v-model="newEditingCircuit.path"/>
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="cancelClicked">Cancel</Button>
        <Button
          type="info"
          :disabled="!areFieldsComplete"
          :loading="circuitIsBeingChecked"
          @click="saveNewCircuit"
        >Save</Button>
      </div>
    </Modal>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import defaultCircuits from '@/default-data/default-circuits';
import { CircuitInterface } from '@/interfaces/general-panel';
import {
  getCircuitList,
  saveCircuitList,
  getCircuitInfo,
} from '@/helpers/backend-helper';
import { saveCircuitPathSync } from '@/helpers/db';

const labelSize = 6;
const contentSize = 14;

export default Vue.extend({
  name: 'CircuitSelection',
  data() {
    return {
      currentCircuit: {} as CircuitInterface,
      isEditing: false,
      newEditingCircuit: {} as CircuitInterface,
      circuitList: [] as Array<CircuitInterface>,
      labelSize,
      contentSize,
      circuitIsBeingChecked: false,
    };
  },
  computed: {
    areFieldsComplete(): boolean {
      const editing = this.newEditingCircuit;
      return !!(editing.name && editing.path && editing.displayName);
    },
  },
  created() {
    this.restoreStoredData();
  },
  methods: {
    addNewCircuit() {
      this.isEditing = true;
    },
    newCircuitNameSelected(newCircuitName: string) {
      const newCircuitSelected = this.findCircuitByName(newCircuitName) || this.circuitList[0];
      this.$store.commit('setCurrentCircuitObj', newCircuitSelected);
      this.currentCircuit = newCircuitSelected;
      this.saveToDB();
    },
    cancelClicked() {
      this.isEditing = false;
      // reset new circuit fields
      this.newEditingCircuit = this.resetCircuit();
    },
    async saveNewCircuit() {
      this.circuitIsBeingChecked = true;
      const circuitInfo = await getCircuitInfo(this.newEditingCircuit.path).catch((e: Error) => {
        this.circuitIsBeingChecked = false;
        this.$Message.error(e.message);
      });
      if (!circuitInfo) return;

      const circuitCopy: CircuitInterface = {
        ...this.newEditingCircuit,
        mTypes: circuitInfo.m_types,
        synapseClasses: circuitInfo.synapse_classes,
      };

      this.$store.commit('setCurrentCircuitObj', circuitCopy);
      this.currentCircuit = circuitCopy;
      this.updateOrAddToCircuitList(circuitCopy);
      this.isEditing = false;
      this.circuitIsBeingChecked = false;
      // reset new circuit fields
      this.newEditingCircuit = this.resetCircuit();
      this.saveToDB();
    },
    findCircuitByName(circuitName: string): CircuitInterface | undefined {
      return this.circuitList.find((c: CircuitInterface) => c.name === circuitName);
    },
    updateOrAddToCircuitList(newCircuit: CircuitInterface): CircuitInterface {
      const circuitOnList = this.circuitList.find(
        (c: CircuitInterface) => c.path === newCircuit.path,
      );
      if (!circuitOnList) { // add it as a new one
        this.circuitList.push(newCircuit);
        return newCircuit;
      }
      // update the info of the already existing one
      circuitOnList.name = newCircuit.name;
      circuitOnList.displayName = newCircuit.displayName;
      circuitOnList.mTypes = newCircuit.mTypes;
      circuitOnList.synapseClasses = newCircuit.synapseClasses;
      return circuitOnList;
    },
    resetCircuit(): CircuitInterface {
      return {
        name: '',
        path: '',
        displayName: '',
        mTypes: [],
        synapseClasses: [],
      };
    },
    saveToDB() {
      const { userId } = this.$store.state;
      saveCircuitList(userId, this.circuitList);
      saveCircuitPathSync(userId, this.currentCircuit.path);
    },
    findCircuitObjByPath(circuitPath: string, circuitList: Array<CircuitInterface>): CircuitInterface | null {
      if (!circuitPath) return null;
      const circuitObjFound = circuitList.find((circuitObj: CircuitInterface) => circuitObj.path === circuitPath);
      return circuitObjFound || null;
    },
    async restoreStoredData() {
      const { userId } = this.$store.state;
      const { circuitPath } = this.$store.getters;

      const storedCircuitList: Array<CircuitInterface> = await getCircuitList(userId);
      const storedCircuitSelected: CircuitInterface | null = this.findCircuitObjByPath(circuitPath, storedCircuitList);

      if (storedCircuitSelected && circuitPath !== storedCircuitSelected.path) {
        throw new Error('Circuit saved does not match');
      }

      this.circuitList = storedCircuitList.length ? storedCircuitList : Object.assign([], defaultCircuits);
      this.currentCircuit = storedCircuitSelected || Object.assign([], defaultCircuits[0]);
      this.newEditingCircuit = this.resetCircuit();
      this.$store.commit('setCurrentCircuitObj', this.currentCircuit);
    },
    removeCircuit(circuitName: string, event: Event): boolean {
      if (!circuitName) return false;

      const newCircuitList = this.circuitList.filter((circuitObj: CircuitInterface) => (
        circuitObj.name !== circuitName
      ));
      this.circuitList = newCircuitList;

      event.stopPropagation();
      if (circuitName !== this.currentCircuit.name) {
        // as the trigger newCircuitNameSelected won't be called, save params
        this.saveToDB();
      }
      return true;
    },
  },
});
</script>


<style lang="scss">
.circuit-selection {
  .circuit-path-in-option {
    margin-left: 10px;
    color: #ccc;
    font-size: 12px;
  }
  .remove-circuit {
    margin-left: 10px;
  }
  li.ivu-select-item {
    text-align: left;
  }
}
</style>
