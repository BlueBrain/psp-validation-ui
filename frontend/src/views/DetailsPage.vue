
<template>
  <div class="details-page">
    <DetailsHeader :job-info="resultData.jobInfo"/>
    <DetailsFiles :id="id"/>
    <PlotComponent :plot-list="resultData.plotList"/>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import sortBy from 'lodash/sortBy';
import DetailsFiles from '@/components/details-page/DetailsFiles.vue';
import DetailsHeader from '@/components/details-page/DetailsHeader.vue';
import PlotComponent from '@/components/details-page/PlotComponent.vue';
import { getJobExpandedById, getValidationPlots } from '@/helpers/backend-helper';
import { JobProperties } from '@/interfaces/unicore';
import { FullResultsInfo } from '@/interfaces/details';
import { PlotsPathsObj } from '@/interfaces/backend';

const clearResults = (): FullResultsInfo => ({
  jobInfo: {} as JobProperties,
  plotList: [] as Array<PlotsPathsObj>,
});

export default Vue.extend({
  name: 'DetailsPage',
  props: {
    id: String,
  },
  data() {
    return {
      resultData: clearResults() as FullResultsInfo,
    };
  },
  created() {
    this.resultData = clearResults();
    this.$nextTick(() => this.fillData());
  },
  methods: {
    async fillData() {
      const jobInfo: JobProperties | null = await getJobExpandedById(this.id);
      if (!jobInfo) throw new Error(`Job not found: ${this.id}`);
      this.$set(this.resultData, 'jobInfo', jobInfo);

      let plotList = await getValidationPlots(jobInfo);
      plotList = sortBy(plotList, 'pathwayName');
      this.$set(this.resultData, 'plotList', plotList);
    },
  },
  components: {
    DetailsFiles,
    DetailsHeader,
    PlotComponent,
  },
});
</script>


<style lang="scss" scoped>
.details-page {
  margin-top: 5vh;

  .details-header {
    margin-bottom: 5vh;
  }
  .plot-component {
    margin-bottom: 5vh;
  }
  .details-files {
    text-align: left;
    margin-bottom: 5vh;
  }
}
</style>
