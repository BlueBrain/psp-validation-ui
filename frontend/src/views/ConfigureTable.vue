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

    <Modal
      v-model="showModal"
      @on-ok="submitValidation"
      :loading="true"
      title="Submit Job"
    >
      <i-input v-model="jobTitle">
        <span slot="prepend">Job Title:</span>
      </i-input>
    </Modal>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import PSPTable from '@/components/configure-table/PSPTable.vue';
import { submitPspJob } from '@/helpers/backend-helper';
import { PspJobExtraParams } from '@/interfaces/backend';
import { JobProperties } from '@/interfaces/unicore';

export default Vue.extend({
  name: 'ConfigureTable',
  components: {
    PSPTable,
  },
  created() {
    this.$store.commit('changeTitle', 'Configure Validation Pathways');
  },
  data() {
    return {
      showModal: false,
      jobTitle: '',
    };
  },
  methods: {
    runValidation() {
      // eslint-disable-next-line
      const tableComponent = (this.$refs.pspTableRef as any);

      const errorWasFound: boolean = tableComponent.tableHasErrors();

      if (errorWasFound) {
        this.$Message.error({
          content: 'Correct the errors to continue',
          // background: true,
          duration: 5,
        });
        return;
      }
      this.saveTable();
      this.jobTitle = `${this.$store.getters.circuitName} - ${(new Date()).toDateString()}`;
      this.showModal = true;
    },
    submitValidation() {
      // eslint-disable-next-line
      const tableComponent = (this.$refs.pspTableRef as any);

      const yamlFiles: Array<string> = tableComponent.getDataToYamlFiles();
      const { circuitPath } = this.$store.getters;

      const extraParams: PspJobExtraParams = {
        generalParams: this.$store.state.generalParamsModule.generalParams,
        userId: this.$store.state.userId,
        title: this.jobTitle || null,
      };
      submitPspJob(yamlFiles, circuitPath, extraParams)
        .then((jobInfo: JobProperties) => {
          this.showModal = false;
          this.$Message.info({
            content: `Job Created: ${jobInfo.id}`,
            duration: 6,
          });
        })
        .catch((e: Error) => {
          this.$Message.error(`Error submitting psp job: ${e.message}`);
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
