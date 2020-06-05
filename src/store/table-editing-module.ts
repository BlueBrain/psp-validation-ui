
import { TableStateInterface, EditingObject } from '@/interfaces/store';

const tableEditingModule = {
  state: {
    currentlyEditingRowIndex: -1,
    currentlyEditingPath: '',
    currentlyEditingValue: '',
    currentlyEditingTarget: {},
  } as TableStateInterface,
  mutations: {
    setCurrentEditObj(state: TableStateInterface, elementObj: EditingObject) {
      state.currentlyEditingPath = elementObj.path;
      state.currentlyEditingRowIndex = elementObj.rowIndex;
      state.currentlyEditingValue = elementObj.value;
      state.currentlyEditingTarget = elementObj.target;
    },
    modifyStoredValue(state: TableStateInterface, newValue: string) {
      state.currentlyEditingValue = newValue;
    },
  },
};

export default tableEditingModule;
