import { ObjectId } from 'bson';
import { ClientSession } from 'mongoose';
import { IODataParamsDB } from './odata-params.types';
import { IMongooseFindExecItem, IMongooseFindExecItems, IUpdateManyRepositoryResult } from './mongoose.types';
import { IPagination } from './pagination.types';
import { IFiles } from './http-request.types';
import { ModuleRef } from '@nestjs/core';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work';
import { IRepositoryPort } from '../ports/repositories';
import { IExpressRequest } from './express.types';
import { RecordAny } from './any.types';
import { FullPartial } from '@shared/typings/partial.types';
import { IQuery } from '@shared/typings/query-string.types';

export interface IRequestMetadata {
  ipAddress?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  endpoint?: string;
  origin?: string;
  headers?: RecordAny;
  queryParams?: RecordAny;
  body?: RecordAny;
  host?: string;
  referrer?: string;
}

export interface IUsecaseParams<Entity, Input = FullPartial<Entity>> {
  input?: Input;
  inputValidated?: Input;
  dbSession?: ClientSession;
  closeSessionAfterCommitting?: boolean;
  files?: IFiles;
  id?: ObjectId;
  ids?: ObjectId[];
  documentByIdInDB?: FullPartial<Entity>;
  createdDocument?: FullPartial<Entity>;
  requestMetadata?: IRequestMetadata;
  request?: IExpressRequest;
  docsWithUpdatedFields?: Pick<IUpdateManyRepositoryResult<Entity>, 'docsWithUpdatedFields'>['docsWithUpdatedFields'];
}

export interface IUpdateUsecaseParams<Entity> extends IUsecaseParams<Entity, FullPartial<Entity>> {
  id: ObjectId;
  documentByIdInDB?: FullPartial<Entity>;
}

export interface IUpdateManyUsecaseBody<Entity = RecordAny>
  extends Pick<IUpdateManyUsecaseParams<Entity>, 'filter' | 'ids' | 'input'> {}

export interface IUpdateManyUsecaseParams<Entity> extends IUsecaseParams<Entity, FullPartial<Entity>> {
  ids?: ObjectId[];
  filter?: RecordAny;
  documentByIdInDB?: FullPartial<Entity>;
}

export interface ICreateUsecaseParams<Entity> extends IUsecaseParams<Entity, FullPartial<Entity>> {}

export interface ICreateManyUsecaseParams<Entity> extends IUsecaseParams<Entity, FullPartial<Entity>[]> {}

export interface IBulkWriteUsecaseParams<Entity> extends IUsecaseParams<Entity, FullPartial<Entity>[]> {}

export interface IBaseDeleteSoftUsecaseParams<Entity> extends IUsecaseParams<Entity> {
  id?: ObjectId;
  ids?: ObjectId[];
  documentByIdInDB?: FullPartial<Entity>;
  cascadeCleanupOrphanedRefs?: boolean;
}
export interface IDeleteSoftUsecaseParams<Entity> extends Omit<IBaseDeleteSoftUsecaseParams<Entity>, 'ids'> {
  id: ObjectId;
}
export interface IDeleteSoftManyUsecaseParams<Entity> extends IBaseDeleteSoftUsecaseParams<Entity> {
  ids: ObjectId[];
}

export interface IReadUsecaseParams<Entity> {
  rawQueryString?: string;
  dbSession?: ClientSession;
  closeSessionAfterCommitting?: boolean;
  odataDBParams?: IODataParamsDB;
  query?: IQuery;
  userIdFromRequest?: ObjectId;
  items?: FullPartial<Entity>[];
  item?: FullPartial<Entity>;
  removeSensitiveFields?: boolean;
  request?: IExpressRequest;
}
export interface IGetAllUsecaseParams<Entity> extends IReadUsecaseParams<Entity> {
  itemsFromDB?: IMongooseFindExecItems<Entity>;
  totalItems?: number;
  items?: FullPartial<Entity>[];
  pagination?: IPagination;
}

export interface IGetByPropsUsecaseParams<Entity> extends IReadUsecaseParams<Entity> {
  itemsFromDB?: IMongooseFindExecItems<Entity>;
  totalItems?: number;
  items?: FullPartial<Entity>[];
  pagination?: IPagination;
  props: { prop: string; value: any }[];
}

export interface IGetByIdUsecaseParams<Entity> {
  rawQueryString?: string;
  dbSession?: ClientSession;
  closeSessionAfterCommitting?: boolean;
  odataDBParams?: IODataParamsDB;
  itemFromDB?: IMongooseFindExecItem<Entity>;
  item?: FullPartial<Entity>;
  id: ObjectId;
  query?: IQuery;
  userIdFromRequest?: ObjectId;
  request?: IExpressRequest;
}


export interface IDeleteSoftUsecaseOutput {
  id: ObjectId;
  is_deleted: boolean;
}

export type IDeleteSoftManyUsecaseOutput = IDeleteSoftUsecaseOutput[];

export interface IUsecaseDependencies<EntityService> {
  repository?: IRepositoryPort;
  service?: EntityService;
  unitOfWork?: UnitOfWork;
  moduleRef?: ModuleRef;
}
