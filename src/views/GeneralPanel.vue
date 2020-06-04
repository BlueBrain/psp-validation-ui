
<template>
  <div class="general-panel">
    <div class="circuit-selection-container">
      <span class="subtitle">Select Circuit:</span>
      <CircuitSelection />
    </div>
    <div class="general-params-container">
      <GeneralParams />
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


<script>
import GeneralParams from '@/components/general-panel/GeneralParams.vue'; // use another name?
import CircuitSelection from '@/components/general-panel/CircuitSelection.vue';

export default {
  name: 'GeneralPanel',
  components: {
    GeneralParams,
    CircuitSelection,
  },
  created() {
    this.$store.commit('changeTitle', 'New PSP Validation');
  },
};
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
