import { Stringified } from '@shared/typings/any.types';

export function stringifyWithType<T>(obj: T): Stringified<T> {
  return JSON.stringify(obj) as Stringified<T>;
}
