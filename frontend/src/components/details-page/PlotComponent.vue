
<template>
  <div class="plot-component">
    <Spin v-if="!plotList || !plotList.length"></Spin>
    <div
      class="patways"
      v-for="pathway in plotList"
      :key="pathway.pathwayName"
    >
      <span class="pathway-title">
        {{ pathway.pathwayName }}
      </span>

      <div class="img-container">
        <div
          v-for="pair in pathway.pairsArray"
          :key="pair.name"
        >
          <img :src="pair.plotData">
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { PlotsPathsObj } from '@/interfaces/backend';

export default Vue.extend({
  name: 'PlotComponent',
  props: {
    plotList: Array as () => Array<PlotsPathsObj>,
  },
});
</script>


<style lang="scss" scoped>
.plot-component {
  display: flex;
  justify-content: space-around;

  img {
    max-width: 80%;
  }

  .pathway-title {
    font-size: 1.5em;
    font-weight: bold;
    color: #0083CB;
  }
}
</style>
