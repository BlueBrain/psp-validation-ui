
<template>
  <div class="plot-component">
    <Spin v-if="isLoading" size="large"></Spin>
    <Alert
      v-if="!isLoading && plotList && !plotList.length"
      type="warning"
    >No plots were found</Alert>

    <div
      v-if="!isLoading && plotList.length"
      class="tree-container"
    >
      <div class="tree-text">Select the plots to show:</div>
      <Tree
        :data="checkboxPlotList"
        @on-check-change="plotCheckChanged"
        show-checkbox
        check-directly
        ref="filesTreeRef"
      />
    </div>

    <div class="plots-container">
      <div
        class="patways"
        v-for="pathway in plotsToRender"
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
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { PlotsPathsObj, FilesTreeInterface } from '@/interfaces/backend';


export default Vue.extend({
  name: 'PlotComponent',
  props: {
    plotList: Array as () => Array<PlotsPathsObj>,
  },
  data() {
    return {
      isLoading: true,
      checkboxPlotList: [] as Array<FilesTreeInterface>,
      plotsToShow: [] as Array<string>,
    };
  },
  computed: {
    plotsToRender(): Array<PlotsPathsObj> {
      return this.plotList.filter((plot: PlotsPathsObj) => (
        this.plotsToShow.includes(plot.pathwayName)
      ));
    },
  },
  watch: {
    plotList() {
      this.isLoading = false;
      this.fillCheckboxes();
    },
  },
  methods: {
    fillCheckboxes() {
      this.checkboxPlotList = [{
        title: 'All',
        expand: true,
        checked: true,
        children: this.plotList.map((pathObj: PlotsPathsObj) => ({ title: pathObj.pathwayName })),
      }];

      const plotsNames = this.plotList.map((plot: PlotsPathsObj) => (plot.pathwayName));
      this.plotsToShow = plotsNames;
    },
    plotCheckChanged(selected: Array<FilesTreeInterface>) {
      const plotsNames = selected.map((plot: FilesTreeInterface) => (plot.title));
      this.plotsToShow = plotsNames;
    },
  },
});
</script>


<style lang="scss">
.plot-component {
  .tree-container {
    margin-left: 20px;

    .tree-text {
      text-align: left;
    }
    .ivu-tree {
      > .ivu-tree-children {
        > li {
          display: flex;

          > ul.ivu-tree-children > li {
            margin-top: 0;
          }
        }
      }
    }
  }

  .ivu-spin {
    display: flex;
    justify-content: center;
  }

  .plots-container {
    display: flex;
    overflow-x: scroll;
    padding-bottom: 10px;

    img {
      max-width: 90%;
    }
    .download-button {
      display: block;
    }
    .patways {
      max-width: 45%;
      min-width: 500px;
    }
    .pathway-title {
      font-size: 1.5em;
      font-weight: bold;
      color: #0083CB;
    }
  }
}
</style>
