
<template>
  <div class="general-params">
    <Row type="flex" justify="center">
      <i-col :span="columnSize">
        <span class="label">Pairs:</span>
        <span class="content">
          <InputNumber :min="1" v-model="generalParams.pairs"/>
        </span>
      </i-col>

      <i-col :span="columnSize">
        <span class="label">Clamp:</span>
        <span class="content">
          <Radio disabled :value="true">{{ generalParams.clamp }}</Radio>
        </span>
      </i-col>

      <i-col :span="columnSize">
        <span class="label">Save Traces:</span>
        <span class="content">
          <Checkbox v-model="generalParams.saveTraces"></Checkbox>
        </span>
      </i-col>
    </Row>


    <Row type="flex" justify="center">
      <i-col :span="columnSize">
        <span class="label">Repetitions:</span>
        <span class="content">
          <InputNumber :min="1" v-model="generalParams.repetitions"/>
        </span>
      </i-col>

      <i-col :span="columnSize" :offset="columnSize">
        <span class="label">Save Amplitudes:</span>
        <span class="content">
          <Checkbox v-model="generalParams.saveAmplitudes"></Checkbox>
        </span>
      </i-col>
    </Row>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { GeneralPanelParamsInterface } from '@/interfaces/general-panel';
import { saveGeneralParams, getStoredGeneralPanelParams } from '@/helpers/db';

const columnSize = 8;

export default Vue.extend({
  name: 'GeneralParams',
  data() {
    return {
      columnSize,
      generalParams: {} as GeneralPanelParamsInterface,
    };
  },
  watch: {
    generalParams: {
      handler(newParams: GeneralPanelParamsInterface) {
        this.$store.commit('setGeneralPanelParams', newParams);
      },
      deep: true,
    },
  },
  created() {
    this.restoreStoredData();
  },
  methods: {
    saveToDB() {
      saveGeneralParams(this.generalParams);
    },
    async restoreStoredData() {
      const storedParams: GeneralPanelParamsInterface = await getStoredGeneralPanelParams();
      this.generalParams = storedParams || this.$store.state.generalParamsModule.generalParams;
    },
  },
});
</script>


<style lang="scss" scoped>
.general-params {
  .label {
    width: 120px;
    text-align: right;
    margin-right: 5px;
    display: inline-block;
  }
  .content {
    width: 120px;
    text-align: left;
    display: inline-block;
  }
}
</style>
