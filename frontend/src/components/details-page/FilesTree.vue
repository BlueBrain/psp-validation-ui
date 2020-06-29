
<template>
  <div class="files-tree">
    <div v-if="validationFiles.length">
      <Tree
        :data="validationFiles"
        show-checkbox
        check-directly
        ref="filesTreeRef"
      />

      <Button
        size="small"
        type="primary"
        icon="ios-download-outline"
        :loading="isDownloading"
        @click="download"
      >Download</Button>
    </div>
    <div v-else>
      <Spin size="large"></Spin>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { getValidationResultFiles, getBulkFilesById } from '@/helpers/backend-helper';
import { FilesTreeInterface } from '@/interfaces/backend';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default Vue.extend({
  name: 'FilesTree',
  props: {
    id: String,
  },
  data() {
    return {
      validationFiles: [] as Array<FilesTreeInterface>,
      isDownloading: false,
    };
  },
  mounted() {
    getValidationResultFiles(this.id)
      .then((tree: Array<FilesTreeInterface>) => {
        this.validationFiles = tree;
      });
  },
  methods: {
    download() {
      this.isDownloading = true;
      const table = (this.$refs.filesTreeRef as any);
      const checked = table.getCheckedNodes();
      const fileNames = checked
        .filter((fileObj: FilesTreeInterface) => {
          if (fileObj.children) return false;
          return true;
        })
        .map((fileObj: FilesTreeInterface) => (fileObj.title));

      const result = getBulkFilesById(this.id, fileNames);
      result.then((fileContentList: Array<Blob>) => {
        const zip = new JSZip();
        fileContentList.forEach((fileContent: Blob, index: number) => {
          zip.file(fileNames[index], fileContent);
        });
        zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
          saveAs(content, 'result-files.zip');
          this.isDownloading = false;
        });
      });
    },
  },
});
</script>


<style lang="scss">
.files-tree {
  .ivu-tree {
    > .ivu-tree-children:first-child {
      > li {
        display: flex;

        > ul.ivu-tree-children > li {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
