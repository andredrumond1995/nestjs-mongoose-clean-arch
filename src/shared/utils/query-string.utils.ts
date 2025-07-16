import { IQuery } from '@shared/typings/query-string.types';
import { ObjectId } from 'bson';
import { isEmpty } from 'lodash';

export const getQueryStringParamValue = (queryString: string, param: string): string | null => {
  const params = new URLSearchParams(queryString);

  return params.get(param);
};

export const generateODataFilterForIds = (ids: ObjectId[], field: string, operator: string = 'or'): string => {
  if (isEmpty(ids)) {
    return `${field} eq null`;
  }

  const filterConditions = ids.map((id) => `${field} eq '${id.toString()}'`).join(` ${operator} `);
  return filterConditions;
};

export const buildQueryString = (query: IQuery): string => {
  const {
    $filter,
    $top,
    $skip,
    $orderby,
    $select,
    $expand,
    $include_deleted,
    $populate,
    $nestedFilter,
    $selectPopulate,
    $aggregate,
  } = query;

  let queryString = '';

  let isFirstParam = true;

  const addParam = (param: string, value: any): void => {
    if (isFirstParam) {
      queryString += `?${param}=${value}`;
      isFirstParam = false;
    } else {
      queryString += `&${param}=${value}`;
    }
  };

  if ($populate) {
    addParam('$populate', $populate);
  }
  if ($filter) {
    addParam('$filter', $filter);
  }
  if ($top) {
    addParam('$top', $top);
  }
  if ($skip) {
    addParam('$skip', $skip);
  }
  if ($select) {
    addParam('$select', $select);
  }
  if ($orderby) {
    addParam('$orderby', $orderby);
  }
  if ($expand) {
    addParam('$expand', $expand);
  }
  if ($nestedFilter) {
    addParam('$nestedFilter', $nestedFilter);
  }
  if ($selectPopulate) {
    addParam('$selectPopulate', $selectPopulate);
  }
  if ($aggregate) {
    addParam('$aggregate', $aggregate);
  }
  if ($include_deleted) {
    addParam('$include_deleted', $include_deleted);
  }
  return queryString;
};
