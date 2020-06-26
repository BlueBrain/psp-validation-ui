
<template>
  <div class="details-page">
    <DetailsHeader :job-info="resultData.jobInfo"/>
    <PlotComponent :result-data="resultData"/>
    <DetailsFiles :result-data="resultData"/>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import DetailsFiles from '@/components/details-page/DetailsFiles.vue';
import DetailsHeader from '@/components/details-page/DetailsHeader.vue';
import PlotComponent from '@/components/details-page/PlotComponent.vue';
import { getJobExpandedById } from '@/helpers/backend-helper';
import { JobProperties } from '@/interfaces/unicore';
import { FullResultsInfo } from '@/interfaces/details';

const emptyResults: FullResultsInfo = {
  jobInfo: {} as JobProperties,
};

export default Vue.extend({
  name: 'DetailsPage',
  props: {
    id: String,
  },
  data() {
    return {
      resultData: emptyResults as FullResultsInfo,
    };
  },
  created() {
    this.fillData();
  },
  methods: {
    async fillData() {
      const jobInfo: JobProperties | null = await getJobExpandedById(this.id);
      if (!jobInfo) throw new Error(`Job not found: ${this.id}`);
      this.$set(this.resultData, 'jobInfo', jobInfo);
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
  margin-top: 15vh;

  .details-header {
    margin-bottom: 10vh;
  }
  .plot-component {
    margin-bottom: 10vh;
  }
  .details-files {
    margin-bottom: 10vh;
    text-align: left;
  }
}
</style>
