
<template>
  <div class="details-files">
    <Collapse>
      <Panel name="1">
        BlueConfig
        <p slot="content">{{ resultData.blueConfig }}</p>
      </Panel>
      <Panel name="2">
        Pathways
        <p slot="content">{{ resultData.pathways }}</p>
      </Panel>
    </Collapse>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DetailsFiles',
  props: {
    resultData: Object, // TODO add complex type
  },
});
</script>
