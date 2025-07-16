import { ServiceMethodsEnum } from '@shared/application/enums/service.enums';
import {
  IBulkWriteUsecaseParams,
  ICreateManyUsecaseParams,
  ICreateUsecaseParams,
  IDeleteSoftManyUsecaseParams,
  IDeleteSoftUsecaseParams,
  IGetAllUsecaseParams,
  IGetByIdUsecaseParams,
  IGetByPropsUsecaseParams,
  IUpdateUsecaseParams,
} from '@shared/application/types/usecases.types';
import { FullPartial } from '@shared/typings/partial.types';
import { IPaginatedItems } from '@shared/typings/pagination.types';
import { IServiceParams } from '@shared/application/types/services.types';

export class Service<Entity> {
  protected static SKIP_ALL_ODATA_PARAM_VALUE = 100;

  public constructor(protected params: IServiceParams) {}

  private getInjectedInstanceOnDemand(token: ServiceMethodsEnum): any {
    const injection = this.params.injections.find((injection) => injection.method === token);

    if (!injection) {
      throw new Error(`No injection found for method: ${token}`);
    }

    const injectedInstance = this.params.moduleRef.get(injection.token, { strict: false });

    if (!injectedInstance || typeof injectedInstance['execute'] !== 'function') {
      throw new Error(
        `Injected Instance not found or execute method missing for token: ${String(injection.token)}, method: ${token}`,
      );
    }

    return injectedInstance;
  }

  public async getAll(params: IGetAllUsecaseParams<Entity>): Promise<IPaginatedItems<FullPartial<Entity>[]>> {
    const injectedInstance = this.getInjectedInstanceOnDemand(ServiceMethodsEnum.GET_ALL);
    return injectedInstance.execute(params);
  }

  public async getByProps(params: IGetByPropsUsecaseParams<Entity>): Promise<IPaginatedItems<FullPartial<Entity>[]>> {
    const injectedInstance = this.getInjectedInstanceOnDemand(ServiceMethodsEnum.GET_BY_PROPS);
    return injectedInstance.execute(params);
  }

  public async getById(params: IGetByIdUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    const injectedInstance = this.getInjectedInstanceOnDemand(ServiceMethodsEnum.GET_BY_ID);
    return injectedInstance.execute(params);
  }

  public async createMany(params: ICreateManyUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    const injectedInstance = this.getInjectedInstanceOnDemand(ServiceMethodsEnum.CREATE_MANY);
    return injectedInstance.execute(params);
  }

  public async bulkWrite(params: IBulkWriteUsecaseParams<Entity>): Promise<FullPartial<Entity>[]> {
    const injectedInstance = this.getInjectedInstanceOnDemand(ServiceMethodsEnum.BULK_WRITE);
    return injectedInstance.execute(params);
  }

  public async updateMany(params: IGetByIdUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    const injectedInstance = this.getInjectedInstanceOnDemand(ServiceMethodsEnum.UPDATE_MANY);
    return injectedInstance.execute(params);
  }

  public async deleteSoft(params: IDeleteSoftUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    const injectedInstance = this.getInjectedInstanceOnDemand(ServiceMethodsEnum.DELETE_SOFT);
    return injectedInstance.execute(params);
  }

  public async deleteSoftMany(params: IDeleteSoftManyUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    const injectedInstance = this.getInjectedInstanceOnDemand(ServiceMethodsEnum.DELETE_SOFT_MANY);
    return injectedInstance.execute(params);
  }

  public async create(params: ICreateUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    const injectedInstance = this.getInjectedInstanceOnDemand(ServiceMethodsEnum.CREATE);
    return injectedInstance.execute(params);
  }

  public async updateById(params: IUpdateUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    const injectedInstance = this.getInjectedInstanceOnDemand(ServiceMethodsEnum.UPDATE_BY_ID);
    return injectedInstance.execute(params);
  }
}
