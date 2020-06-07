
import { Target } from '@/interfaces/table';

interface EditingObject {
  rowIndex: number;
  path: string;
  value: string;
  target: Target;
}

interface TableStateInterface {
  currentlyEditingRowIndex: number;
  currentlyEditingPath: string;
  currentlyEditingValue: string;
  currentlyEditingTarget: Target;
}

interface StateInterface {
  title: string;
  packageVersion: string;
}

export default {};

export {
  EditingObject,
  TableStateInterface,
  StateInterface,
};
