
<template>
  <div class="plot-component">
    <Spin v-if="isLoading" size="large"></Spin>
    <Alert
      v-if="!isLoading && plotList && !plotList.length"
      type="warning"
    >No plots were found</Alert>
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
          <a
            :download="pair.name + '.png'"
            :href="pair.plotData"
            class="download-button"
          >
            <Button
              size="small"
              ghost
              icon="ios-download-outline"
              type="primary"
            >Download</Button>
          </a>
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
  data() {
    return {
      isLoading: true,
    };
  },
  watch: {
    plotList() {
      this.isLoading = false;
    },
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

  .download-button {
    display: block;
  }

  .pathway-title {
    font-size: 1.5em;
    font-weight: bold;
    color: #0083CB;
  }
}
</style>
