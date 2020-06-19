
<template>
  <div class="circuit-selection">
    <Select :value="currentCircuit.name" @on-change="newCircuitNameSelected">
      <Option
        v-for="circuit in circuitList"
        :key="circuit.name"
        :value="circuit.name"
        :label="circuit.displayName"
      >
        <span>{{ circuit.name }}</span>
        <span class="circuit-path-in-option">({{ circuit.path }})</span>
      </Option>
    </Select>
    <Button @click="addNewCircuit" icon="md-add">New</Button>

    <Modal
      v-model="isEditing"
      title="Edit Circuit"
      @on-cancel="cancelClicked"
    >
      <Row>
        <!-- use i-col to avoid linting error -->
        <i-col :span="labelSize">Name</i-col>
        <i-col :span="contentSize">
          <Input v-model="newEditingCircuit.name"/>
        </i-col>
      </Row>
      <Row>
        <i-col :span="labelSize">Path</i-col>
        <i-col :span="contentSize">
          <Input v-model="newEditingCircuit.path"/>
        </i-col>
      </Row>
      <Row>
        <i-col :span="labelSize">Display Name</i-col>
        <i-col :span="contentSize">
          <Input v-model="newEditingCircuit.displayName"/>
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="cancelClicked">Cancel</Button>
        <Button
          type="info"
          :disabled="!areFieldsComplete"
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
  saveCircuitList,
  saveCircuitSelected,
  getStoredGeneralPanelCircuitSelected,
  getStoredGeneralPanelCircuitList,
  saveCircuitPathSync,
} from '@/helpers/db';

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
      const newCircuitSelected = this.findCircuitByName(newCircuitName);
      this.$store.commit('setCurrentCircuitObj', newCircuitSelected);
      this.currentCircuit = newCircuitSelected;
    },
    cancelClicked() {
      this.isEditing = false;
      // reset new circuit fields
      this.newEditingCircuit = { name: '', path: '', displayName: '' };
    },
    saveNewCircuit() {
      const circuitCopy: CircuitInterface = { ...this.newEditingCircuit };
      this.$store.commit('setCurrentCircuitObj', circuitCopy);
      this.currentCircuit = circuitCopy;
      this.updateOrAddToCircuitList(circuitCopy);
      this.isEditing = false;
      // reset new circuit fields
      this.newEditingCircuit = this.resetCircuit();
    },
    findCircuitByName(circuitName: string): CircuitInterface {
      const foundCircuit = this.circuitList.find((c: CircuitInterface) => c.name === circuitName);
      if (foundCircuit === undefined) throw new TypeError('Element not found in circuit list!');
      return foundCircuit;
    },
    updateOrAddToCircuitList(newCircuit: CircuitInterface): CircuitInterface {
      const circuitOnList = this.circuitList
        .find((c: CircuitInterface) => c.name === newCircuit.name);
      if (!circuitOnList) { // add it as a new one
        this.circuitList.push(newCircuit);
        return newCircuit;
      }
      circuitOnList.path = newCircuit.path;
      circuitOnList.displayName = newCircuit.displayName;
      return circuitOnList;
    },
    resetCircuit(): CircuitInterface {
      return { name: '', path: '', displayName: '' };
    },
    saveToDB() {
      saveCircuitList(this.circuitList);
      saveCircuitSelected(this.currentCircuit);
      saveCircuitPathSync(this.currentCircuit.path);
    },
    async restoreStoredData() {
      const { circuitPath } = this.$store.state.generalParamsModule;
      const storedCircuitList: Array<CircuitInterface> = await getStoredGeneralPanelCircuitList();
      const storedCircuitSelected: CircuitInterface | void = await getStoredGeneralPanelCircuitSelected();
      if (storedCircuitSelected && circuitPath !== storedCircuitSelected.path) {
        throw new Error('Circuit saved does not match');
      }
      this.circuitList = storedCircuitList || Object.assign([], defaultCircuits);
      this.currentCircuit = storedCircuitSelected || Object.assign([], defaultCircuits[0]);
      this.newEditingCircuit = this.resetCircuit();
      this.$store.commit('setCurrentCircuitObj', this.currentCircuit);
    },
  },
});
</script>


<style lang="scss">
.circuit-selection .circuit-path-in-option {
  margin-left: 20px;
  color: #ccc;
  font-size: 12px;
}
</style>
