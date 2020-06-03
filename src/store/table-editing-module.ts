
import { EditingObject } from '@/interfaces/store';

const tableEditingModule = {
  state: {
    currentlyEditingRow: null,
    currentlyEditingColumn: null,
    currentlyEditingValue: null,
  },
  mutations: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    setCurrentEditObj(state: any, elementObj: EditingObject) {
      state.currentlyEditingColumn = elementObj.column;
      state.currentlyEditingRow = elementObj.row;
      state.currentlyEditingValue = elementObj.value;
    },
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    modifyCurrentValue(state: any, newValue: string) {
      state.currentlyEditingValue = newValue;
    },
  },
};

export default tableEditingModule;
