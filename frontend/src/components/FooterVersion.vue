
<template>
  <div class="footer-version">
    <span>Version </span>
    <span>{{$store.state.packageVersion}}</span>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FooterVersion',
});
</script>
