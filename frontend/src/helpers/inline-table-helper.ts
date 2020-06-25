
import isNaN from 'lodash/isNaN';
import toNumber from 'lodash/toNumber';
import { ruleNames } from '@/constants/rule-names';
import { CheckResultInterface, TableRowInterface } from '@/interfaces/table';

function validURL(str: string) {
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

const mapRuleFunction = {
  [ruleNames.POSITIVE]: (value: string): boolean => {
    const numb = parseFloat(value);
    return numb >= 0;
  },
  [ruleNames.FLOAT]: (value: string): boolean => {
    const numb = toNumber(value);
    /* use this instead of parseFloat due
    parseFloat(0.tttt) => 0 instead of NaN */
    return !isNaN(numb);
  },
  [ruleNames.URL]: (value: string): boolean => {
    const isValid = validURL(value);
    return isValid;
  },
};

function getRuleFunctionByName(ruleName: string) {
  return mapRuleFunction[ruleName];
}

function checkStringByRule(value: string, rules: Array<string>): CheckResultInterface {
  // allow None parameters
  if (value === 'None') return { message: '', hasError: false };
  let message = '';

  const rulesPassed = rules.every((rule: string) => {
    const ruleFn = getRuleFunctionByName(rule);
    const result = ruleFn(value);
    if (!result) {
      message = `Value "${value}" is not compliant with rule [${rule}]`;
      return false;
    }
    return true;
  });
  if (!rulesPassed) return { message, hasError: true };
  return { message: '', hasError: false };
}

function hasErrors(dataObjArray: Array<TableRowInterface>) {
  let errorWasFound = false;

  const iterate = (obj: TableRowInterface) => {
    Object.keys(obj).forEach((key: string) => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      if (key === 'hasError' && (obj as any)[key]) {
        errorWasFound = true;
      }
      // TODO: fix this obj[key]
      if (typeof ((obj as any)[key]) === 'object') {
        iterate((obj as any)[key]);
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });
    return obj;
  };

  function hasSomeError(element: TableRowInterface) {
    iterate(element);
    return errorWasFound;
  }

  dataObjArray.some(hasSomeError);
  return errorWasFound;
}

export default {};

export {
  checkStringByRule,
  getRuleFunctionByName,
  hasErrors,
};