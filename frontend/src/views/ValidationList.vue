
<template>
  <div class="validation-list">
    <ResultsTable
      :is-loading="isLoading"
      :validations="validationsWithFiles"
    />
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { getValidationsWithFiles } from '@/helpers/backend-helper';
import ResultsTable from '@/components/validation-list/ResultsTable.vue';
import { ValidationsWithFiles } from '@/interfaces/results';

export default Vue.extend({
  name: 'ValidationList',
  components: {
    ResultsTable,
  },
  data() {
    return {
      circuitPath: '',
      isLoading: true,
      validationsWithFiles: [],
    };
  },
  mounted() {
    this.restoreStoredData();
    this.getValidations();
  },
  created() {
    this.$store.commit('changeTitle', 'Validation List');
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
        .then((validationsWithFiles: Array<ValidationsWithFiles>) => {
          this.isLoading = false;
          this.$set(this, 'validationsWithFiles', validationsWithFiles);
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
