<template>
  <div class="about">
    <h1>This is an about page</h1>
    <PSPTable></PSPTable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PSPTable from '@/components/PSPTable.vue';

export default Vue.extend({
  name: 'About',
  components: {
    PSPTable,
  },
});
</script>
