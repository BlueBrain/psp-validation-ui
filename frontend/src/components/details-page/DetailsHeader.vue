
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

  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { JobProperties } from '@/interfaces/unicore';
import { getFinalStatus, getJobPhysicalLocation } from '@/helpers/backend-helper';

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
});
</script>


<style lang="scss">
.details-header {
  .custom-tag-group {
    margin: 10px;
    color: red;
    .ivu-tag {
      margin-right: 0;
    }
  }
}
</style>
