
<template>
  <div class="results-table-expand">
    <Alert
      v-if="error"
      type="warning"
      class="error-message"
    >File was not found</Alert>

    <div v-if="!error && !files.length">
      <Spin size="large"></Spin>
    </div>

    <div v-for="(file, index) in files" :key="index">
      <div class="pre-post">{{ file.pathway.pre }} - {{ file.pathway.post }}</div>

      <div class="title">Reference</div>
      <Row>
        <i-col :span="defaultColumSize">
          <span class="subtitle">- PSP Amplitude</span>
        </i-col>
        <i-col :span="defaultColumSize">
          <span class="expand-key">mean: </span>
          <span class="expand-value">{{ file.reference.psp_amplitude.mean }}</span>
        </i-col>
        <i-col :span="defaultColumSize">
          <span class="expand-key">std: </span>
          <span class="expand-value">{{ file.reference.psp_amplitude.std }}</span>
        </i-col>
        <i-col span="9">
          <span class="expand-key">link to paper: </span>
          <span class="expand-value">{{ file.reference.psp_amplitude.link }}</span>
        </i-col>
      </Row>

      <Row>
        <i-col :span="defaultColumSize">
          <span class="subtitle">- Synapse Count</span>
        </i-col>
        <i-col :span="defaultColumSize">
          <span class="expand-key">mean: </span>
          <span class="expand-value">{{ file.reference.synapse_count.mean }}</span>
        </i-col>
        <i-col :span="defaultColumSize">
          <span class="expand-key">std: </span>
          <span class="expand-value">{{ file.reference.synapse_count.std }}</span>
        </i-col>
        <i-col span="9">
          <span class="expand-key">link to paper: </span>
          <span class="expand-value">{{ file.reference.synapse_count.link }}</span>
        </i-col>
      </Row>

      <Divider />
      <div class="title">Pathways Constraints</div>
      <Row>
        <i-col :span="defaultColumSize">
          <span class="expand-key">min number of synapses: </span>
          <span class="expand-value">{{ file.pathway.constraints.min_nsyn }}</span>
        </i-col>
        <i-col :span="defaultColumSize">
          <span class="expand-key">max number of synapses: </span>
          <span class="expand-value">{{ file.pathway.constraints.max_nsyn }}</span>
        </i-col>
      </Row>
      <Row>
        <i-col :span="defaultColumSize">
          <span class="expand-key">max distance in x: </span>
          <span class="expand-value">{{ file.pathway.constraints.max_dist_x }}</span>
        </i-col>
        <i-col :span="defaultColumSize">
          <span class="expand-key">max distance in y: </span>
          <span class="expand-value">{{ file.pathway.constraints.max_dist_y }}</span>
        </i-col>
        <i-col :span="defaultColumSize">
          <span class="expand-key">max distance in z: </span>
          <span class="expand-value">{{ file.pathway.constraints.max_dist_z }}</span>
        </i-col>
      </Row>

      <Divider />
      <div class="title">Prototol</div>
      <Row>
        <i-col :span="defaultColumSize">
          <span class="expand-key">steady-state voltage: </span>
          <span class="expand-value">{{ file.protocol.hold_V }}</span>
        </i-col>
        <i-col :span="defaultColumSize">
          <span class="expand-key">post ttx: </span>
          <span class="expand-value">{{ file.protocol.post_ttx }}</span>
        </i-col>
      </Row>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { RowToYamlInterface } from '@/interfaces/table';
import { getFilesFromBackend } from '@/helpers/backend-helper';

const defaultColumSize = 5;

export default Vue.extend({
  name: 'ResultsTableExpand',
  props: {
    id: String,
  },
  data() {
    return {
      files: [] as Array<RowToYamlInterface>,
      defaultColumSize,
      error: false,
    };
  },
  created() {
    getFilesFromBackend(this.id)
      .then((files: Array<RowToYamlInterface>) => {
        this.files = files;
        this.error = false;
      })
      .catch(() => {
        this.error = true;
      });
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
  .pre-post {
    margin: 15px 0 5px 0;
    font-size: 1.5em;
    color: #0083CB;
    text-align: center;
    border-bottom: 2px dashed;
  }
  .error-message {
    text-align: center;
  }
}
</style>
