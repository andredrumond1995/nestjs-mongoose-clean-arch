import {
  IODataParamsDB,
  IODataQueryParam,
  AggregateConfig,
} from '@shared/application/types/odata-params.types';
import { RecordAny } from '@shared/typings/any.types';
import {
  join,
  defaults,
  filter,
  find,
  first,
  nth,
  split,
  startsWith,
  uniq,
  map,
  isEmpty,
  reduceRight,
  includes,
  keys,
  compact,
  reduce,
  tail,
  merge,
  dropWhile,
  omitBy,
  cloneDeep,
  forEach,
  chain,
  toNumber,
  trim,
  drop,
  toArray,
} from 'lodash';
import { PopulateOptions } from 'mongoose';
import { createQuery } from 'odata-v4-mongodb';
import { buildQueryString } from './generate-rawquerystring-from-not-empty-values.util';
import { IQuery } from '@shared/typings/query-string.types';
import { getQueryStringParamValue } from '@shared/utils/query-string.utils';
import { convertToObjectIdNestedProps } from '@shared/utils/object-id.utils';
import { MONGODB_AGGREGATE_PATH_CONFIGS } from '@shared/application/constants/mongodb/mongodb-aggregate-path-configs.constants';
import { MONGODB_POPULATE_COLLECTION_REFS } from '@shared/application/constants/mongodb/mongodb-populate-collection-refs.constants';
import { getDefaultOdataQueryParams } from '@shared/application/constants/mongodb/mongodb-query-params.constants';


function extractSizeInAndNestedQueryFromFilter(filterStr: string): {
  inQuery: RecordAny;
  nestedQuery: RecordAny;
  remainingFilter: string;
  sizeQuery: RecordAny;
} {
  if (!filterStr) return { inQuery: {}, nestedQuery: {}, sizeQuery: {}, remainingFilter: '' };

  const inRegex = /(?:'([^']+)'|(\b\w+\b))\s+in\s+\(([^)]+)\)/gi;
  const nestedEqRegex = /'([^']+)'\s+eq\s+(?:'([^']+)'|(true|false))/gi;
  const containsRegex = /contains\('([^']+)',\s*'([^']+)'\)/gi;
  const sizeRegex = /size\(([^)]+)\)\s+(eq|ne|gt|lt|gte|lte)\s+([0-9]+)/gi;

  const inQuery = {};
  const nestedQuery = {};
  const sizeQuery = {};
  let remainingFilter = filterStr;

  // Primeiro processa condições IN
  const inMatches = Array.from(remainingFilter.matchAll(inRegex) || []);
  forEach(inMatches, (match) => {
    const [fullMatch, nestedProp, normalProp, valuesStr] = match;
    const propName = nestedProp || normalProp;

    const values = chain(valuesStr.split(','))
      .map(trim)
      .map((v) => {
        if (/^'[^']*'$/.test(v)) return trim(v, "'");
        return isFinite(toNumber(v)) ? toNumber(v) : v;
      })
      .value();

    inQuery[propName] = { $in: values };
    remainingFilter = remainingFilter.replace(fullMatch, '').trim();
  });

  // Depois processa condições contains('prop.path', eq 'value')
  const containsMatches = Array.from(remainingFilter.matchAll(containsRegex)) || [];
  forEach(containsMatches, (match) => {
    const [fullMatch, propPath, value] = match;
    nestedQuery[propPath] = new RegExp(value, 'gi');
    remainingFilter = remainingFilter.replace(fullMatch, '').trim();
  });

  // Depois processa condições EQ em nested props
  const eqMatches = Array.from(remainingFilter.matchAll(nestedEqRegex)) || [];
  forEach(eqMatches, (match) => {
    const [fullMatch, propPath, stringValue, booleanValue] = match;
    const rawValue = stringValue !== undefined ? stringValue : booleanValue;
    const normalizedValue = rawValue === 'true' ? true : rawValue === 'false' ? false : trim(rawValue, "'");
    nestedQuery[propPath] = normalizedValue;
    remainingFilter = remainingFilter.replace(fullMatch, '').trim();
  });

  // ✅ Processa size(...)
  const sizeMatches = Array.from(remainingFilter.matchAll(sizeRegex)) || [];
  forEach(sizeMatches, (match) => {
    const [fullMatch, prop, operator, numStr] = match;
    const mongoOpMap = {
      eq: '$eq',
      ne: '$ne',
      gt: '$gt',
      lt: '$lt',
      gte: '$gte',
      lte: '$lte',
    };

    const mongoOp = mongoOpMap[operator.toLowerCase()];
    const num = toNumber(numStr);
    sizeQuery[prop] = {
      size: {
        $expr: {
          [mongoOp]: [{ $size: `$${prop}` }, num],
        },
      },
    };
    remainingFilter = remainingFilter.replace(fullMatch, '').trim();
  });

  // Limpeza final do remainingFilter
  remainingFilter = chain(remainingFilter)
    .replace(/(^\s*(and|or)\s*|\s*(and|or)\s*$)/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .value();

  remainingFilter = remainingFilter
    .replace(/\s+(or|and)\s+(or|and)\s+/gi, ' $1 ') // junta or or → or
    .replace(/^\s*(or|and)\s+/gi, '') // remove or no começo
    .replace(/\s+(or|and)\s*$/gi, '') // remove or no final
    .replace(/\s+/g, ' ') // colapsa espaços extras
    .trim();

  if (startsWith(remainingFilter, 'and ')) remainingFilter = join(drop(toArray(remainingFilter), 4), '');
  if (startsWith(remainingFilter, 'or ')) remainingFilter = join(drop(toArray(remainingFilter), 3), '');

  remainingFilter = remainingFilter ? remainingFilter : '';

  return {
    inQuery,
    nestedQuery,
    remainingFilter,
    sizeQuery,
  };
}

export const createOdataMongoDB = (rawQueryString: string, query?: IQuery): IODataParamsDB => {
  let queryString = decodeURIComponent(rawQueryString);
  const includeDeleted = includes(queryString, '$include_deleted=true');
  try {
    const { inQuery, nestedQuery, remainingFilter, sizeQuery } = extractSizeInAndNestedQueryFromFilter(
      query?.$filter as string,
    );
    if (query && !isEmpty(query.$filter)) {
      query.$filter = remainingFilter;
      query.$include_deleted = `${includeDeleted}`;
      queryString = buildQueryString(query);
    } else if (query && !isEmpty(query)) {
      queryString = buildQueryString(query);
    }
    queryString = queryString.replace('?', '');

    const extractedOdataParams = extractOdataV4QueryParams(queryString);
    let odataParams: IODataParamsDB = getDefaultOdataQueryParams();

    if (!isEmpty(extractedOdataParams)) {
      odataParams = defaults(createQuery(extractedOdataParams), getDefaultOdataQueryParams());
    }

    odataParams.query = {
      ...odataParams.query,
      ...inQuery,
      ...nestedQuery,
      ...sizeQuery,
    };
    const populate = cloneDeep(getPopulateFromRawQueryString(queryString));

    const aggregate = cloneDeep(getAggregateFromRawQueryString(queryString));

    const clonedOdataParams = cloneDeep(odataParams);

    let clonedQuery = cloneDeep(clonedOdataParams.query) ?? {};

    clonedQuery.is_deleted = false;

    clonedQuery = includeDeletedOdataParamHandler(clonedQuery, queryString);

    clonedOdataParams.query = convertToObjectIdNestedProps(clonedQuery);

    clonedOdataParams.populate = populate;

    clonedOdataParams.aggregate = aggregate;


    return clonedOdataParams;
  } catch (error) {
    throw new Error(`Invalid raw QueryString: '${queryString}'`);
  }
};

export const includeDeletedOdataParamHandler = (
  query: IODataQueryParam = {},
  decodedRawQueryString: string = '',
): IODataQueryParam => {
  const clonedQuery = cloneDeep(query);
  const includeDeleted = includes(decodedRawQueryString, '$include_deleted=true');

  if (includeDeleted) delete clonedQuery.is_deleted;

  return clonedQuery;
};

export const getOdataParamValuesFromRawQueryString = (
  rawQueryString: string = '',
  odataQueryParam: string = '',
): string[] => {
  const queryParams = rawQueryString.split('&');
  const populateParam = find(queryParams, (param) => startsWith(param, odataQueryParam));
  const populateValues = nth(split(populateParam, '='), 1);
  const valuesSplitted = uniq(split(populateValues, ','));

  return valuesSplitted;
};

const getPopulateFromRawQueryString = (rawQueryString: string = ''): PopulateOptions[] => {
  const valuesSplitted = compact(getOdataParamValuesFromRawQueryString(rawQueryString, '$populate='));
  const result = compact(
    map(valuesSplitted, (pathToPopulate: string) => {
      const selectPopulatePaths = getSelectPopulateFromRawQueryString(rawQueryString);

      return getPopulateObjectForMongoDB(pathToPopulate, selectPopulatePaths);
    }),
  );

  return result;
};

const getAggregateFromRawQueryString = (rawQueryString: string = ''): AggregateConfig[] => {
  const valuesSplitted = getOdataParamValuesFromRawQueryString(rawQueryString, '$aggregate=');

  return uniq(compact(map(valuesSplitted, getAggregateObjectForMongoDB)));
};

export const getSelectPopulateFromRawQueryString = (rawQueryString: string = ''): string[] => {
  const valuesSplitted = getOdataParamValuesFromRawQueryString(rawQueryString, '$selectPopulate=');

  return valuesSplitted;
};

export const getSelectPopulateForCurrentPath = (currentPopulatePath: string, selectsToApply: string[]): RecordAny =>
  reduce(
    map(selectsToApply, (select) =>
      omitBy(
        {
          [join(tail(dropWhile(split(select, '.'), (item) => item !== currentPopulatePath)), '.')]: 1,
        },
        (_, prop) => isEmpty(prop),
      ),
    ),
    (acc: RecordAny, curr: RecordAny) => merge(acc, curr),
    {},
  );

export const getSelectsPopulateToApply = (selectPopulatePaths: string[], currentPopulatePath: string): string[] =>
  filter(selectPopulatePaths, (path: string) => includes(split(path, '.'), currentPopulatePath));

export const getAllPopulatedValuesForPathToPopulate = (
  clearedPaths: string[],
  selectPopulatePaths: string[],
): PopulateOptions =>
  reduceRight<string, PopulateOptions>(
    clearedPaths,
    (acc: PopulateOptions, curr: string) => {
      const result = cloneDeep(MONGODB_POPULATE_COLLECTION_REFS[curr]);
      const selectsToApply = getSelectsPopulateToApply(selectPopulatePaths, curr);
      const selectForCurrentPath = getSelectPopulateForCurrentPath(curr, selectsToApply);

      if (!isEmpty(selectForCurrentPath)) result.select = selectForCurrentPath;

      if (acc) result.populate = acc;

      return result;
    },
    {} as PopulateOptions,
  );

export const getPopulateObjectForMongoDB = (pathToPopulate: string, selectPopulatePaths: string[]): PopulateOptions => {
  const splittedPaths = split(pathToPopulate, '.');
  const clearedPaths = clearPopulatePath(splittedPaths);
  const allPopulatedValues = getAllPopulatedValuesForPathToPopulate(clearedPaths, selectPopulatePaths);

  return cloneDeep(allPopulatedValues);
};

export const getAggregateObjectForMongoDB = (pathToAggregate: string): AggregateConfig => {
  const config = MONGODB_AGGREGATE_PATH_CONFIGS[pathToAggregate];

  return cloneDeep(config);
};

export const clearPopulatePath = (splittedPaths: string[]): string[] => {
  const commonElements: string[] = [];

  for (const value of splittedPaths) {
    if (includes(keys(MONGODB_POPULATE_COLLECTION_REFS), value)) commonElements.push(value);
    else break;
  }

  return uniq(commonElements);
};

export const extractOdataV4QueryParams = (rawQueryString: string): string => {
  const paramsToExtract = ['$select', '$filter', '$top', '$skip', '$expand', '$orderby'];
  const params = split(rawQueryString, '&');
  const filteredParams = filter(params, (param) => {
    const key = first(split(param, '='));
    return key !== undefined && paramsToExtract.includes(key);
  });

  return join(filteredParams, '&');
};
