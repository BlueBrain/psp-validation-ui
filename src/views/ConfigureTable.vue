<template>
  <div class="configure-table">
    <PSPTable></PSPTable>

    <div class="buttons-container">
      <router-link :to="{name: 'GeneralPanel'}">
        <Button>
          <Icon type="ios-arrow-back" />
          Back
        </Button>
      </router-link>

      <Button type="success" @click="runValidation">Run PSP</Button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PSPTable from '@/components/configure-table/PSPTable.vue';

export default Vue.extend({
  name: 'ConfigureTable',
  components: {
    PSPTable,
  },
  created() {
    this.$store.commit('changeTitle', 'Configure Validation Pathways');
  },
  methods: {
    runValidation() {
      this.$Modal.warning({
        title: 'Configure Job',
        content: 'This is a placeholder for the configuration of the job',
      });
    },
  },
});
</script>


<style lang="scss">
.configure-table {
  margin-top: 20vh;

  .buttons-container {
    width: 200px;
    display: flex;
    justify-content: space-between;
    margin: 40px auto;
  }
}
</style>
