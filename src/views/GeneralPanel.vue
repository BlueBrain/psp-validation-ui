
<template>
  <div class="general-panel">
    <CircuitSelection />
    <GeneralParams />
  </div>
</template>


<script>
import GeneralParams from '@/components/general-panel/GeneralParams.vue'; // use another name?
import CircuitSelection from '@/components/general-panel/CircuitSelection.vue';

export default {
  name: 'GeneralPanel',
  components: {
    GeneralParams,
    CircuitSelection,
  },
};
</script>
