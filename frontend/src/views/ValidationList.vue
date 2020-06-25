
<template>
  <div class="validation-list">
    <ResultsTable
      :is-loading="isLoading"
      :validations="validationsExpanded"
    />
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { getValidationsExpanded } from '@/helpers/backend-helper';
import ResultsTable from '@/components/validation-list/ResultsTable.vue';
import { ValidationsExpanded } from '@/interfaces/results';

export default Vue.extend({
  name: 'ValidationList',
  components: {
    ResultsTable,
  },
  data() {
    return {
      circuitPath: '',
      isLoading: true,
      validationsExpanded: [],
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
      getValidationsExpanded(this.circuitPath)
        .then((validationsExpanded: Array<ValidationsExpanded>) => {
          this.isLoading = false;
          this.$set(this, 'validationsExpanded', validationsExpanded);
        })
        .catch((e: Error) => this.$Message.error(`Error getting jobs ${e.message}`));
    },
  },
});
</script>


<style lang="scss" scoped>
.validation-list {
  margin-top: 20vh;
}
</style>
