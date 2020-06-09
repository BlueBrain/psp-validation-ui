
<template>
  <div class="details-header">
    <span class="custom-tag-group">
      <Tag color="primary">Status</Tag>
      <Tag>{{ resultData.status }}</Tag>
    </span>

    <span class="custom-tag-group">
      <Tag color="primary">Launched</Tag>
      <Tag>{{ resultData.launched }}</Tag>
    </span>

    <span class="custom-tag-group">
      <Tag color="primary">Started By</Tag>
      <Tag>{{ resultData.startedBy }}</Tag>
    </span>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DetailsHeader',
  props: {
    resultData: Object, // TODO add complex result type
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
