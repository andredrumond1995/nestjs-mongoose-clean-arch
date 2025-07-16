import { FullPartial } from '@shared/typings/partial.types';
import { ObjectId } from 'bson';
import { Document, PopulateOptions, QueryWithHelpers } from 'mongoose';
import { RecordAny, MergedTypes } from './any.types';

export interface IMongoosePopulateVirtuals<Entity> {
  populateVirtuals?(): FullPartial<Entity>;
}
export interface IUpdateManyRepositoryResult<Entity> {
  matchedCount: number;
  modifiedCount: number;
  updatedIds: ObjectId[];
  docsWithUpdatedFields: FullPartial<Entity>[];
}
export type IMongooseFindExecItems<Entity> = (IMongooseFindExecItem<Entity> & IMongoosePopulateVirtuals<Entity>)[];
export type IMongooseFindExecItem<Entity> = Document<Entity, RecordAny, RecordAny> & IMongoosePopulateVirtuals<Entity>;
export type IMongooseCreatedDocument<Entity> = Document<Entity>;
export type IMongooseFindQuery<Entity> = QueryWithHelpers<
  Document<Entity, RecordAny, RecordAny>[],
  RecordAny,
  RecordAny,
  RecordAny,
  'find'
>;
export type IMongooseFindOneQuery<Entity> = QueryWithHelpers<Entity | null, Entity, RecordAny, Entity, 'findOne'>;
export type IMongoosePopulateOptions = Record<string, PopulateOptions>;

export type IPopulateMongooseQueryGenerator<Entity> = MergedTypes<
  IMongooseFindQuery<Entity> & IMongooseFindOneQuery<Entity>
>;

export interface IPopulateVirtualsRef {
  name: string;
  shouldKeepAsArray?: boolean;
  fieldsToOmitFromRef?: string[];
  mergeRefObjIntoRootObj?: boolean;
  nestedRefs?: IPopulateVirtualsRef[];
}
