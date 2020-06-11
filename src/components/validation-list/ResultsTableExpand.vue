
<template>
  <div class="results-table-expand">
    <Divider />
    <div class="title">Reference</div>

    <Row>
      <i-col :span="defaultColumSize">
        <span class="subtitle">- PSP Amplitude</span>
      </i-col>
      <i-col :span="defaultColumSize">
        <span class="expand-key">mean: </span>
        <span class="expand-value">{{ row.reference.pspAmplitude.mean.value }}</span>
      </i-col>
      <i-col :span="defaultColumSize">
        <span class="expand-key">std: </span>
        <span class="expand-value">{{ row.reference.pspAmplitude.std.value }}</span>
      </i-col>
      <i-col span="9">
        <span class="expand-key">link to paper: </span>
        <span class="expand-value">{{ row.reference.pspAmplitude.link.value }}</span>
      </i-col>
    </Row>

    <Row>
      <i-col :span="defaultColumSize">
        <span class="subtitle">- Synapse Count</span>
      </i-col>
      <i-col :span="defaultColumSize">
        <span class="expand-key">mean: </span>
        <span class="expand-value">{{ row.reference.synapseCount.mean.value }}</span>
      </i-col>
      <i-col :span="defaultColumSize">
        <span class="expand-key">std: </span>
        <span class="expand-value">{{ row.reference.synapseCount.std.value }}</span>
      </i-col>
      <i-col span="9">
        <span class="expand-key">link to paper: </span>
        <span class="expand-value">{{ row.reference.synapseCount.link.value }}</span>
      </i-col>
    </Row>

    <Divider />
    <div class="title">Pathways Constraints</div>
    <Row>
      <i-col :span="defaultColumSize">
        <span class="expand-key">min number of synapses: </span>
        <span class="expand-value">{{ row.pathway.constraints.minNumSyn.value }}</span>
      </i-col>
      <i-col :span="defaultColumSize">
        <span class="expand-key">max number of synapses: </span>
        <span class="expand-value">{{ row.pathway.constraints.maxNumSyn.value }}</span>
      </i-col>
    </Row>
    <Row>
      <i-col :span="defaultColumSize">
        <span class="expand-key">max distance in x: </span>
        <span class="expand-value">{{ row.pathway.constraints.maxDistX.value }}</span>
      </i-col>
      <i-col :span="defaultColumSize">
        <span class="expand-key">max distance in y: </span>
        <span class="expand-value">{{ row.pathway.constraints.maxDistY.value }}</span>
      </i-col>
      <i-col :span="defaultColumSize">
        <span class="expand-key">max distance in z: </span>
        <span class="expand-value">{{ row.pathway.constraints.maxDistZ.value }}</span>
      </i-col>
    </Row>

    <Divider />
    <div class="title">Prototol</div>
    <Row>
      <i-col :span="defaultColumSize">
        <span class="expand-key">steady-state voltage: </span>
        <span class="expand-value">{{ row.protocol.holdV.value }}</span>
      </i-col>
      <i-col :span="defaultColumSize">
        <span class="expand-key">post ttx: </span>
        <span class="expand-value">{{ row.protocol.postTtx.value }}</span>
      </i-col>
    </Row>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';

const defaultColumSize = 5;

export default Vue.extend({
  name: 'ResultsTableExpand',
  props: {
    row: Object,
  },
  data() {
    return { defaultColumSize };
  },
});
</script>


<style lang="scss" scoped>
.results-table-expand {
  .title {
    font-size: 22px;
    color: black;
  }
  .subtitle {
    font-size: 16px;
    color: #808695;
  }
  span.expand-key {
    font-weight: bold;
  }
}
</style>
