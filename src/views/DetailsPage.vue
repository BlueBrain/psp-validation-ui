
<template>
  <div class="details-page">
    <DetailsHeader :resultData="resultData"/>
    <PlotComponent :resultData="resultData"/>
    <DetailsFiles :resultData="resultData"/>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { TableEntryObjectInterface } from '@/interfaces/table';
import DetailsFiles from '@/components/details-page/DetailsFiles.vue';
import DetailsHeader from '@/components/details-page/DetailsHeader.vue';
import PlotComponent from '@/components/details-page/PlotComponent.vue';
import resultsMock from '@/default-data/details-mock';

export default Vue.extend({
  name: 'DetailsPage',
  props: {
    tableEntryObject: {} as () => TableEntryObjectInterface,
  },
  data() {
    return {
      resultData: resultsMock,
    };
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
