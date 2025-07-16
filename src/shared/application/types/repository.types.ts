import { ClientSession } from 'mongoose';
import { IODataParamsDB } from './odata-params.types';
import { ObjectId } from 'bson';
import { FullPartial } from '@shared/typings/partial.types';
import { RecordAny } from './any.types';

export interface ICreateRepositoryParams<Entity> {
  input?: FullPartial<Entity>;
  inputValidated?: FullPartial<Entity>;
  dbSession?: ClientSession | undefined;
}

export interface IUpdateRepositoryParams<Entity> {
  input?: FullPartial<Entity>;
  inputValidated?: FullPartial<Entity>;
  dbSession?: ClientSession | undefined;
  id: ObjectId | string;
}

export interface IDeleteSoftRepositoryParams {
  dbSession?: ClientSession | undefined;
  id?: ObjectId | string;
}

export interface IDeleteSoftManyRepositoryParams {
  dbSession?: ClientSession | undefined;
  ids: ObjectId[] | string[];
}

export interface IBulkWriteOperationsRepositoryParam {
  updateOne: {
    filter: RecordAny;
    update: { $set: RecordAny };
    upsert?: boolean;
  };
}
export interface IBulkWriteRepositoryParams {
  operations: IBulkWriteOperationsRepositoryParam[];
  dbSession?: ClientSession;
}

export interface IDeleteRepositoryParams {
  dbSession?: ClientSession | undefined;
  query: RecordAny;
}

export interface IGetAllRepositoryParams {
  dbSession?: ClientSession | undefined | null;
  odataDBParams: IODataParamsDB;
}

export interface IGetByIdRepositoryParams {
  odataDBParams?: IODataParamsDB;
  id: ObjectId | string;
  dbSession?: ClientSession;
}

export interface IGetByPropsRepositoryParams {
  odataDBParams?: IODataParamsDB;
  props: RecordAny;
  dbSession?: ClientSession;
}

export type IGetTotalItemsRepositoryParams = IGetAllRepositoryParams;
