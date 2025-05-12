import { NestedI18n } from "../types";
import { en } from './en';
import { hu } from './hu';


function haveSameKeys(obj1: NestedI18n, obj2: NestedI18n): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every(key => keys2.includes(key));
}

describe('I18n key comparison', () => {
  const enLang = en;
  const huLang = hu;

  it('should have the same keys and no keys containing "."', () => {
    function checkNestedKeys(obj1: NestedI18n, obj2: NestedI18n): boolean {
      for (const key in obj1) {
        if (key.includes('.')) {
          return false;
        }
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' && isNestedI18n(obj1[key]) && isNestedI18n(obj2[key])) {
          if (!checkNestedKeys(obj1[key], obj2[key])) {
            return false;
          }
        } else if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
          return false;
        }
      }
      return true;
    }

    function isNestedI18n(obj: object): obj is NestedI18n {
      return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
    }

    expect(haveSameKeys(enLang, huLang)).toBe(true);
    expect(checkNestedKeys(enLang, huLang)).toBe(true);
  });
});