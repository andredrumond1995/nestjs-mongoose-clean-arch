import { ObjectId } from 'bson';
import { PopulateOptions, SortOrder } from 'mongoose';

export interface AggregateConfig {
  localField: string;
  collectionToAggregate: string;
  foreignField: string;
  as: string;
}

export type IODataNestedFilterOperators = 'eq' | 'ne' | 'gt' | 'lt' | 'lte' | 'gte';
export interface IODataNestedFilter {
  path: string;
  operator: IODataNestedFilterOperators;
  value: any;
}
export interface IOdataPopulateParam {
  root?: string;
  rootSelect?: Record<string, number>;
  subPopulate?: string;
  subPopulateSelect?: Record<string, number>;
}

export type IODataQueryParam = Record<string, string | number | boolean | ObjectId> | Record<string, Record<any, any>>;
export interface IODataParamsDB {
  query?: IODataQueryParam;
  sort?: Record<string, SortOrder>;
  includes?: IODataParamsDB[];
  limit?: number;
  skip?: number;
  projection?: Record<string, number>;
  populate?: PopulateOptions[];
  aggregate?: AggregateConfig[];
  nestedFilters?: IODataNestedFilter[][];
}

export enum EODataDBOperations {
  OR = 'or',
  AND = 'and',
}

export type ODataOperatorFunction = (fieldValue: any, conditionValue: any) => boolean;
