
<template>
  <span class="copy-to-clipboard-btn">
    <Poptip
      title="Job path copied"
      trigger="focus"
    >
      <Button
        @click="copyToClipboard"
        size="small"
        type="primary"
        ghost
        class="clipboard-copy-button"
      >
        <Icon type="ios-copy-outline" />
      </Button>
    </Poptip>
  </span>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'CopyToClipboardBtn',
  props: {
    text: String,
  },
  methods: {
    copyToClipboard() {
      const textToCopy = this.text;
      const input = document.createElement('input');
      input.setAttribute('value', textToCopy);
      document.body.appendChild(input);
      input.select();
      const result = document.execCommand('copy');
      document.body.removeChild(input);
      return result;
    },
  },
});
</script>
