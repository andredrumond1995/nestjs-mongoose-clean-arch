import { head, keys, defaultTo, get } from 'lodash';
import { MongoError } from 'mongodb';

export function duplicatedKeyErrorHelper(exception: MongoError): string {
  const keyValue = get(exception, 'keyValue', {});
  const propertyName = head(keys(keyValue));
  const propertyValue = propertyName ? keyValue[propertyName] : undefined;

  const defaultValueToCheck = 'the request body';
  return `The value for '${defaultTo(
    propertyValue,
    defaultValueToCheck,
  )}' is already on the database and it must be unique.`;
}
