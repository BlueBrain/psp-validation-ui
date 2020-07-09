
<template>
  <div class="general-panel">
    <div class="circuit-selection-container">
      <span class="subtitle">Select Circuit:</span>
      <CircuitSelection ref="circuitSelectionRef"/>
    </div>
    <div class="general-params-container">
      <GeneralParams ref="generalParamsRef"/>
    </div>
    <div class="continue-button-container">
      <router-link :to="{name: 'ConfigureTable'}">
        <Button type="success">
          Continue
          <Icon type="ios-arrow-forward" />
        </Button>
      </router-link>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import GeneralParams from '@/components/general-panel/GeneralParams.vue'; // use another name?
import CircuitSelection from '@/components/general-panel/CircuitSelection.vue';


export default Vue.extend({
  name: 'GeneralPanel',
  components: {
    GeneralParams,
    CircuitSelection,
  },
  created() {
    this.$store.commit('changeTitle', 'New PSP Validation');
  },
  /* eslint-disable @typescript-eslint/typedef */
  beforeRouteLeave(to, from, next) {
    (this.$refs.circuitSelectionRef as any).saveToDB();
    (this.$refs.generalParamsRef as any).saveToDB();
    next();
  },
});
</script>


<style lang="scss">
.general-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20vh;

  .circuit-selection-container {
    display: flex;
    align-items: center;
    > span {
      font-size: 20px;
    }

    .circuit-selection {
      display: flex;
      justify-content: space-around;
      width: 600px;

      .ivu-select {
        max-width: 400px;
      }
    }
  }

  .general-params-container {
    margin-top: 20px;
  }

  .continue-button-container {
    margin-top: 40px;
  }
}
</style>
