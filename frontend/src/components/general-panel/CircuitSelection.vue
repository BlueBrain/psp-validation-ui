
<template>
  <div class="circuit-selection">
    <Select
      :value="currentCircuit.name"
    >
      <Option
        v-for="circuit in circuitList"
        :key="circuit.name"
        :value="circuit.name"
        :label="circuit.displayName"
      >
        <span class="circuit-path-in-option">({{ circuit.path }})</span>
      </Option>
    </Select>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { CircuitInterface } from '@/interfaces/general-panel';

const labelSize = 6;
const contentSize = 14;

export default Vue.extend({
  name: 'CircuitSelection',
  data() {
    return {
      isEditing: false,
      newEditingCircuit: {} as CircuitInterface,
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
    circuitList(): Array<CircuitInterface> {
      return this.$store.getters.currentCircuitList;
    },
    currentCircuit(): CircuitInterface {
      return this.$store.getters.currentCircuit;
    },
  },
  created() {
    this.restoreStoredData();
  },
  methods: {
    resetCircuit(): CircuitInterface {
      return {
        name: '',
        path: '',
        displayName: '',
        mTypes: [],
        synapseClasses: [],
      };
    },
    async restoreStoredData() {
      this.newEditingCircuit = this.resetCircuit();
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
