import { Document, Model, UpdateWriteOpResult, ClientSession } from 'mongoose';
import { BulkWriteResult, ChangeStream, ChangeStreamDocument, DeleteResult } from 'mongodb';
import {
  IBulkWriteRepositoryParams,
  ICreateRepositoryParams,
  IDeleteRepositoryParams,
  IDeleteSoftManyRepositoryParams,
  IDeleteSoftRepositoryParams,
  IGetAllRepositoryParams,
  IGetByIdRepositoryParams,
  IGetByPropsRepositoryParams,
  IGetTotalItemsRepositoryParams,
  IUpdateRepositoryParams,
} from '@shared/application/types/repository.types';
import {
  IMongooseFindExecItem,
  IMongooseFindExecItems,
  IUpdateManyRepositoryResult,
} from '@shared/application/types/mongoose.types';

export interface IRepositoryPort {
  setModel(model: Model<Document>): void;
  startSession(): Promise<ClientSession>;
  getAll<Entity>(params: IGetAllRepositoryParams): Promise<IMongooseFindExecItems<Entity>>;
  getTotalItems(params: IGetTotalItemsRepositoryParams): Promise<number>;
  create<Entity>(params: ICreateRepositoryParams<Entity>): Promise<Entity>;
  bulkWrite(params: IBulkWriteRepositoryParams): Promise<BulkWriteResult>;
  update<Entity>(params: IUpdateRepositoryParams<Entity>): Promise<UpdateWriteOpResult>;
  deleteSoft?(params: IDeleteSoftRepositoryParams): Promise<UpdateWriteOpResult>;
  deleteSoftMany?<Entity>(params: IDeleteSoftManyRepositoryParams): Promise<IUpdateManyRepositoryResult<Entity>>;
  delete?(params: IDeleteRepositoryParams): Promise<DeleteResult>;
  getById?<Entity>(params: IGetByIdRepositoryParams): Promise<IMongooseFindExecItem<Entity> | null>;
  getByProps?<Entity>(params: IGetByPropsRepositoryParams): Promise<IMongooseFindExecItem<Entity> | null>;
  getWatcher(...params: any[]): ChangeStream<Document, ChangeStreamDocument<Document>>;
}
