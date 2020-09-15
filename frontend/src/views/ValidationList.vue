
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
      validationsExpanded: [] as Array<ValidationsExpanded>,
      inactiveStartTime: 0,
    };
  },
  mounted() {
    this.restoreStoredData();
    this.getValidations();
    // refresh validations after 5 mins of inactivity if the page is not visible
    document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
  },
  created() {
    this.$store.commit('changeTitle', 'Validation List');
  },
  methods: {
    restoreStoredData() {
      const { circuitPath } = this.$store.getters;
      if (!circuitPath) {
        const msg = 'There is no circuit selected. Redirecting home page';
        this.$router.push({ path: '/' });
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
    handleVisibilityChange() {
      if (document.hidden) {
        this.inactiveStartTime = new Date().getTime();
      } else {
        const endTime = new Date().getTime();
        const duration = (endTime - this.inactiveStartTime) / 1000 / 60; // mins
        if (duration > 5) this.getValidations();
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange, false);
  },
});
</script>


<style lang="scss">
.validation-list {
  margin-top: 5vh;

  .ivu-table-body {
    cursor: pointer;
  }
}
</style>
