
<template>
  <div class="details-header">
    <span class="custom-tag-group">
      <Tag color="primary">Status</Tag>
      <Tag>{{ status }}</Tag>
    </span>

    <span class="custom-tag-group">
      <Tag color="primary">Launched</Tag>
      <Tag>{{ submissionDate }}</Tag>
    </span>

    <span class="custom-tag-group">
      <Tag color="primary">Location</Tag>
      <Tag>{{ location }}</Tag>
    </span>

    <span class="actions">
      <Button
        @click="deleteValidation"
        size="small"
        type="error"
        icon="ios-trash"
      >Delete</Button>
    </span>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { JobProperties } from '@/interfaces/unicore';
import { getFinalStatus, getJobPhysicalLocation, deleteJob } from '@/helpers/backend-helper';

const loadingMessage = 'loading...';

export default Vue.extend({
  name: 'DetailsHeader',
  props: {
    jobInfo: Object as () => JobProperties, // TODO add complex result type
  },
  computed: {
    status(): string {
      if (!this.jobInfo.status) return loadingMessage;
      return getFinalStatus(this.jobInfo);
    },
    submissionDate(): string {
      if (!this.jobInfo.submissionTime) return loadingMessage;
      const date = new Date(this.jobInfo.submissionTime);
      return date.toLocaleString();
    },
    location(): string {
      if (!this.jobInfo.log) return loadingMessage;
      const location = getJobPhysicalLocation(this.jobInfo.log);
      return location;
    },
  },
  methods: {
    deleteValidation() {
      const jobUrl = this.jobInfo._links.self.href;
      this.$Modal.warning({
        title: 'Delete validation',
        content: 'Are you sure you want to remove this validation?',
        loading: true,
        onOk: () => {
          deleteJob(jobUrl)
            .then(() => {
              this.$Modal.remove();
              this.$router.push({ path: '/list' });
              this.$Message.info('Job Deleted');
            })
            .catch((e: Error) => {
              throw new Error(`error deleting ${e} - ${jobUrl}`);
            });
        },
      });
    },
  },
});
</script>


<style lang="scss">
.details-header {
  .actions {
    float: right;
    margin-right: 10px;
  }

  .custom-tag-group {
    margin-left: 10px;
    color: red;
    .ivu-tag {
      margin-right: 0;
    }
  }
}
</style>
