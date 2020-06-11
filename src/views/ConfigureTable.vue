<template>
  <div class="configure-table">
    <PSPTable ref="pspTableRef"></PSPTable>

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
      this.saveTable();
      // eslint-disable-next-line
      const yamlFiles = (this.$refs.pspTableRef as any).getDataYamlToFiles();

      // TODO save these YAML files and pass the circuit path and
      // general params from store to the backend

      this.$Modal.warning({
        title: 'Configure Job',
        content: 'This is a placeholder for the configuration of the job',
      });
    },
    saveTable() {
      // TODO check why this is failing without parsing
      // eslint-disable-next-line
      (this.$refs.pspTableRef as any).saveToDB();
    },
  },
  /* eslint-disable-next-line */
  beforeRouteLeave(to, from, next) {
    this.saveTable();
    next();
  },
});
</script>


<style lang="scss">
.configure-table {
  margin-top: 15vh;

  .buttons-container {
    width: 200px;
    display: flex;
    justify-content: space-between;
    margin: 40px auto;
  }
}
</style>
