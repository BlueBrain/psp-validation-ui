
<template>
  <div>
    <Button
      @click="openLink"
      size="small"
      type="primary"
      ghost
    >
      <Icon type="md-open" />
      Open
    </Button>
    <Button
      @click="editLink"
      size="small"
    >
      <Icon type="md-create" />
    </Button>

    <Modal v-model="showModal">
      <p slot="header"></p>
      <Input
        v-model="localValue"
        @on-enter="linkChanged"
      />
      <p slot="footer"></p>
    </Modal>

  </div>
</template>


<script lang="ts">
import Vue, { PropType } from 'vue';
import get from 'lodash/get';
import {
  ChangeTableCellEventInterface,
  TableRowInterface,
  TableColumnInterface,
  CheckResultInterface,
} from '@/interfaces/table';
import { checkStringByRule } from '@/helpers/inline-table-helper';
import { ruleNames } from '@/constants/rule-names';


export default Vue.extend({
  name: 'InlineLinkEdit',
  props: {
    row: Object as PropType<TableRowInterface>,
    column: Object as PropType<TableColumnInterface>,
    index: Number,
  },
  data() {
    return {
      showModal: false,
      localValue: '',
    };
  },
  methods: {
    openLink() {
      const url = get(this.row, this.column.path).value;
      window.open(url, '_blank');
    },
    editLink() {
      this.localValue = get(this.row, this.column.path).value;
      this.showModal = true;
    },
    linkChanged() {
      const rulesToCheck = [ruleNames.URL];
      const valueToCommit = this.localValue;
      const result: CheckResultInterface = checkStringByRule(valueToCommit, rulesToCheck);

      if (result.hasError) {
        this.$Message.error(result.message);
        return;
      }

      this.showModal = false;
      this.$emit('changed', {
        path: `[${this.index}].${this.column.path}`,
        newValue: this.localValue,
      } as ChangeTableCellEventInterface);
      this.localValue = '';
    },
  },
});
</script>
