import { IODataParamsDB } from '@shared/application/types/odata-params.types';
import { cloneDeep } from 'lodash';

export const MONGODB_DEFAULT_SKIP_PARAM = 0;
export const MONGODB_DEFAULT_LIMIT_PARAM = 100;

export const MONGODB_DEFAULT_ODATA_QUERY_PARAMS: IODataParamsDB = {
  skip: MONGODB_DEFAULT_SKIP_PARAM,
  limit: MONGODB_DEFAULT_LIMIT_PARAM,
  query: {},
  sort: {},
  includes: [],
  projection: {},
  populate: [],
  aggregate: [],
};

export function getDefaultOdataQueryParams(): IODataParamsDB {
  return cloneDeep(MONGODB_DEFAULT_ODATA_QUERY_PARAMS);
}
