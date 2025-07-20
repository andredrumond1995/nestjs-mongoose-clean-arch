import { IModuleRef } from './module-ref.types';
import { ServiceMethodsEnum } from '../enums/service.enums';
import { FullPartial } from '@shared/typings/partial.types';
import { RecordAny } from './any.types';
import { IPaginatedItems } from './pagination.types';

export interface IService {
  getAll<TParams = RecordAny, TEntity = RecordAny>(params: TParams): Promise<IPaginatedItems<FullPartial<TEntity>[]>>;

  getById<TParams = RecordAny, TEntity = RecordAny>(params: TParams): Promise<FullPartial<TEntity>>;
}

export interface IServiceInjection {
  token: symbol;
  method: ServiceMethodsEnum;
}
export interface IServiceParams {
  moduleRef: IModuleRef;
  serviceName: string;
  injections: IServiceInjection[];
}
