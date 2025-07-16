import { EODataDBOperations } from '@shared/application/types/odata-params.types';
import { ObjectId } from 'bson';
import { defaultTo, isEmpty, join, map } from 'lodash';

export const dynamicFilterGeneratorUtil = (
  values: (ObjectId | number | string | boolean)[],
  propToFilter: string,
  operation?: EODataDBOperations,
): string => {
  let result = ``;
  const filterValue = `${join(
    map(values, (value) => `${propToFilter} eq '${value}'`),
    ` ${defaultTo(operation, '')} `,
  )}`;

  if (!isEmpty(filterValue)) result = `$filter=${filterValue}`;
  return result;
};
