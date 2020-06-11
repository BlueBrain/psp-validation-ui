
import {
  StoreStateInterface,
  EditingObject,
  Target,
} from '@/interfaces/table';

const stateValues: StoreStateInterface = {
  currentlyEditingRowIndex: -1,
  currentlyEditingRules: [],
  currentlyEditingPath: '',
  currentlyEditingValue: '',
  currentlyEditingTarget: {} as Target,
};

const tableEditingModule = {
  state: stateValues,
  mutations: {
    setCurrentEditObj(state: StoreStateInterface, elementObj: EditingObject) {
      state.currentlyEditingPath = elementObj.path;
      state.currentlyEditingRowIndex = elementObj.rowIndex;
      state.currentlyEditingValue = elementObj.value;
      state.currentlyEditingTarget = elementObj.target;
      state.currentlyEditingRules = elementObj.rules;
    },
    modifyStoredValue(state: StoreStateInterface, newValue: string) {
      state.currentlyEditingValue = newValue;
    },
  },
};

export default tableEditingModule;
