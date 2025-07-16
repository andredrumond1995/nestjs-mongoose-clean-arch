import { filter, isEmpty, join } from 'lodash';
import QueryString from 'qs';

export const generateRawQsFromNotEmptyValues = (values: string[]): string => {
  const notEmptyValues = filter(values, (value: string) => !isEmpty(value));
  const rawQueryString = join(notEmptyValues, '&');

  return rawQueryString;
};

export const buildQueryString = (query: QueryString.ParsedQs): string => {
  const { $filter, $top, $skip, $select, $populate } = query;

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

  return queryString;
};
