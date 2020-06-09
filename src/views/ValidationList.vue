
<template>
  <div class="validation-list">
    <ResultsTable></ResultsTable>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import ResultsTable from '@/components/validation-list/ResultsTable.vue';

export default Vue.extend({
  name: 'ValidationList',
  components: {
    ResultsTable,
  },
});
</script>


<style lang="scss" scoped>
.validation-list {
  margin-top: 20vh;
}
</style>
