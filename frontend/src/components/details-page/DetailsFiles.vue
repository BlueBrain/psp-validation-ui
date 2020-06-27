
<template>
  <div class="details-files">
    <Collapse @on-change="openFile">
      <Panel name="pathways">
        Pathways
        <div slot="content">
          <div v-if="expanded('pathways')">
            <ResultsTableExpand :id="id"/>
          </div>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import ResultsTableExpand from '@/components/validation-list/ResultsTableExpand.vue';

export default Vue.extend({
  name: 'DetailsFiles',
  props: {
    id: String,
  },
  data() {
    return {
      openedFiles: [] as Array<string>,
    };
  },
  components: {
    ResultsTableExpand,
  },
  methods: {
    openFile(fileList: Array<string>) {
      this.openedFiles = fileList;
    },
    expanded(fileName: string): boolean {
      return this.openedFiles.includes(fileName);
    },
  },
});
</script>
