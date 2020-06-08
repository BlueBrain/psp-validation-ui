
<template>
  <div class="plot-component">
    <img src="@/assets/mock-psp-plot.png" alt="psp result plot">
    <img src="@/assets/mock-psp-plot.png" alt="psp result plot">
    <img src="@/assets/mock-psp-plot.png" alt="psp result plot">
  </div>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PlotComponent',
  props: {
    resultData: Object, // TODO add complex type
  },
});
</script>


<style lang="scss" scoped>
.plot-component {
  display: flex;
  justify-content: space-around;

  img {
    max-width: 30%;
  }
}
</style>
