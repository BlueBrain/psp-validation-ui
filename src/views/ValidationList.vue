
<template>
  <div class="validation-list">
    <ResultsTable
      :is-loading="isLoading"
    />
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { getValidationsWithFiles } from '@/helpers/backend-helper';
import ResultsTable from '@/components/validation-list/ResultsTable.vue';

export default Vue.extend({
  name: 'ValidationList',
  components: {
    ResultsTable,
  },
  data() {
    return {
      circuitPath: '',
      isLoading: true,
    };
  },
  mounted() {
    this.restoreStoredData();
    this.getValidations();
  },
  methods: {
    restoreStoredData() {
      const { circuitPath } = this.$store.getters;
      if (!circuitPath) {
        const msg = 'There is no circuit selected';
        this.$Message.error(msg);
        throw new Error(msg);
      }
      this.circuitPath = circuitPath;
    },
    getValidations() {
      getValidationsWithFiles(this.circuitPath)
        .then((files: any) => {
          console.log('Files', files);
          this.isLoading = false;
        })
        .catch((e: Error) => this.$Message.error(`Error getting jobs ${e}`));
    },
  },
});
</script>


<style lang="scss" scoped>
.validation-list {
  margin-top: 20vh;
}
</style>
