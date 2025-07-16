import { ObjectId } from 'bson';
import { cloneDeep, forOwn, includes, isArray, isNumber, isPlainObject } from 'lodash';

export const objectIdComparatorUtil = (a: ObjectId, b: ObjectId): boolean => {
  const isEqual = a.equals(b);
  return isEqual;
};

export const convertToObjectId = <T = ObjectId | string>(value?: T): ObjectId =>
  value ? new ObjectId(value as string) : new ObjectId();
export function convertToObjectIdNestedProps<T>(obj: T, propsToConvert: string[] = ['_id']): T {
  const clonedObj = cloneDeep(obj);

  const processObject = <T = any>(value: T): T => {
    if (isPlainObject(value)) {
      forOwn(value, (v, k) => {
        if (includes(propsToConvert, k) && ObjectId.isValid(v as string)) {
          value[k] = new ObjectId(v as string);
        }
        if (isPlainObject(v) || isArray(v)) {
          processObject(v);
        }
      });
    } else if (isArray(value)) {
      value.forEach((item, index) => {
        const onlyNumbers = /^\d+$/.test(item);
        if (isNumber(item) && onlyNumbers) {
          return;
        } else if (isPlainObject(item) || isArray(item)) {
          processObject(item);
        } else if (includes(propsToConvert, index.toString()) && ObjectId.isValid(item as string)) {
          value[index] = new ObjectId(item as string);
        } else if (ObjectId.isValid(item as string)) {
          value[index] = new ObjectId(item) as T;
        }
      });
    } else if (ObjectId.isValid(value as string)) {
      return new ObjectId(value as string) as T;
    }

    return value;
  };

  processObject(clonedObj);

  // Retorna o objeto modificado
  return clonedObj as T;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isObjectIdValid = (value: any): boolean =>
  typeof value === 'string' && value.length === 24 && ObjectId.isValid(value);
