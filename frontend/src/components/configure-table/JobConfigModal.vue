
<template>
  <div class="job-config-modal">
    <Modal
      v-model="showModal"
      title="Submit Job"
      :closable="false"
      :mask-closable="false"
    >
      <Form
        ref="formValidate"
        label-position="right"
        :label-width="150"
      >
        <form-item prop="name">
          <tooltip
            slot="label"
            content="Name"
          >Name</tooltip>
          <i-input
            v-model="jobName"
            placeholder="Job name"
          />
        </form-item>

        <form-item prop="project">
          <tooltip
            slot="label"
            content="Project"
          >Project</tooltip>
          <i-select v-model="projectSelected">
            <i-option
              v-for="project in projectList"
              :key="project"
              :value="project"
            >{{ project }}</i-option>
          </i-select>
        </form-item>
      </Form>
      <div slot="footer">
        <Button @click="cancel">Cancel</Button>
        <Button
          type="primary"
          :disabled="!fieldsComplete"
          :loading="isSubmitting"
          @click="submitValidation"
        >Launch</Button>
      </div>
    </Modal>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { JobUserSelectedParams } from '@/interfaces/general-panel';
import { getUserProjects } from '@/helpers/auth';
import { getSavedProjectSelected, setProjectSelected } from '@/helpers/db';

export default Vue.extend({
  name: 'JobConfigModal',
  props: {
    showModal: Boolean,
  },
  data() {
    return {
      jobName: '',
      projectSelected: '',
      projectList: [] as Array<string>,
      isSubmitting: false,
    };
  },
  mounted() {
    this.jobName = `${this.$store.getters.circuitName} - ${(new Date()).toDateString()}`;
    getUserProjects().then((projectList: Array<string>) => {
      this.projectList = projectList;
      this.projectSelected = getSavedProjectSelected() || projectList[0];
    });
  },
  computed: {
    fieldsComplete(): boolean {
      return !!(this.jobName.length && this.projectSelected.length);
    },
  },
  methods: {
    submitValidation() {
      this.isSubmitting = true;
      setProjectSelected(this.projectSelected);
      this.$emit('run', {
        name: this.jobName || null,
        project: this.projectSelected,
      } as JobUserSelectedParams);
    },
    cancel() {
      this.$emit('hide-modal');
      this.isSubmitting = false;
    },
  },
});
</script>
