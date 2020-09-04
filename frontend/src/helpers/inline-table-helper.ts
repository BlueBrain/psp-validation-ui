
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
  [ruleNames.POSITIVE]: (value: string): boolean => (toNumber(value) >= 0),
  [ruleNames.FLOAT]: (value: string): boolean => (!isNaN(toNumber(value))),
  [ruleNames.INT]: (value: string): boolean => (!isNaN(parseInt(value, 10))),
  [ruleNames.URL]: (value: string): boolean => (validURL(value)),
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
    return errorWasFound;
  };

  function hasSomeError(element: TableRowInterface) {
    return iterate(element);
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
