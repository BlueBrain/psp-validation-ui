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
import { submitPspJob } from '@/helpers/backend-helper';


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
      const tableComponent = (this.$refs.pspTableRef as any);

      const errorWasFound: boolean = tableComponent.tableHasErrors();
      const yamlFiles: Array<string> = tableComponent.getDataToYamlFiles();
      const { circuitPath } = this.$store.state.generalParamsModule;

      if (errorWasFound) {
        this.$Message.error({
          content: 'Correct the errors to continue',
          // background: true,
          duration: 5,
        });
        return;
      }

      submitPspJob(yamlFiles, circuitPath)
        .then(() => {
          this.$Modal.remove();
        })
        .catch((e: Error) => {
          this.$Message.error(`Error submitting psp job: ${e}`);
        });

      // TODO save these YAML files and pass the circuit path and
      // general params from store to the backend

      const message = `This might take a couple of seconds and then the
      job will be queued and processed in the HPC`;
      this.$Modal.warning({
        title: 'Launch Job',
        content: message,
        loading: true,
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
