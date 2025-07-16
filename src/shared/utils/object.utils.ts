import { RecordAny } from '@shared/typings/any.types';
import { ObjectId } from 'bson';
import { isArray, forOwn, isNil, isEmpty, isPlainObject, isObject, isDate, snakeCase, reduce, isEqual } from 'lodash';

export function clearNilValuesAndEmptyObject<T = Record<any, any>>(obj: T): T {
  if (!isPlainObject(obj) || isArray(obj)) {
    return obj;
  }

  forOwn(obj, (value, key) => {
    if (isNil(value)) {
      delete obj[key];
    }
    else if (isPlainObject(value) && !isArray(value) && isEmpty(value) && !(value instanceof Date)) {
      delete obj[key];
    }
    else if (isPlainObject(value)) {
      clearNilValuesAndEmptyObject(value);
      if (isEmpty(value)) {
        delete obj[key];
      }
    }
  });

  return obj;
}

export function deepConvertKeysToSnakeCase<Output = RecordAny, Input = RecordAny>(obj: Input): Output {
  if (!isObject(obj) || isDate(obj) || ObjectId.isValid(obj as any) || obj instanceof Buffer) {
    return obj as unknown as Output;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepConvertKeysToSnakeCase) as unknown as Output;
  }

  const convertedObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj as Record<string, any>)) {
    const newKey = snakeCase(key);
    convertedObj[newKey] = deepConvertKeysToSnakeCase(value);
  }
  return convertedObj as unknown as Output;
}

export function getChangedFields<PDATA = RecordAny, NDATA = RecordAny>(previousData: PDATA, newData: NDATA): string[] {
  if (isEmpty(newData) || isEmpty(previousData)) return [];

  return reduce(
    newData as object,
    (result: string[], value, key) => {
      if (!isEqual(value, previousData[key])) {
        result.push(key);
      }
      return result;
    },
    [] as string[],
  );
}