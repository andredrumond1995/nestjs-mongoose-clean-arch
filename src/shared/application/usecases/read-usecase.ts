import { castArray, cloneDeep, isEmpty, map, omit, replace } from 'lodash';
import { IRepositoryPort } from '@shared/application/ports/repositories/repository.port';
import { IReadUsecaseParams, IUsecaseDependencies } from '../types/usecases.types';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work/unit-of-work';
import { ModuleRef } from '@nestjs/core';
import { IODataParamsDB } from '../types/odata-params.types';
import { FullPartial } from '@shared/typings/partial.types';
import { createOdataMongoDB } from '../utils/mongodb-odata/create-mongodb-odata.util';
export interface IGetAllUsecaseDependencies<EntityService> {
  repository?: IRepositoryPort;
  service?: EntityService;
  unitOfWork?: UnitOfWork;
  moduleRef?: ModuleRef;
}

export class ReadUsecase<Entity, EntityService> {
  public sensitiveFields: string[] = [];
  protected repository: IRepositoryPort;
  protected service: EntityService;
  protected unitOfWork: UnitOfWork;
  protected moduleRef: ModuleRef;
  public constructor(params: IUsecaseDependencies<EntityService> = {}) {
    const { repository, service, unitOfWork, moduleRef } = params;
    this.repository = repository!;
    this.service = service!;
    this.unitOfWork = unitOfWork!;
    this.moduleRef = moduleRef!;
  }

  protected removeSensitiveFieldsFromItems(params: IReadUsecaseParams<Entity>): FullPartial<Entity>[] {
    const { removeSensitiveFields = true } = params;
    const items = !isEmpty(params.items) ? params.items : isEmpty(params.item) ? [] : castArray(params.item);
    if (!removeSensitiveFields) return items as FullPartial<Entity>[];
    return map(items, (item) => omit(item as object, this.sensitiveFields));
  }

  protected getOdataDBParams(params: IReadUsecaseParams<Entity>): IODataParamsDB {
    const { rawQueryString } = params;
    const odataParams = cloneDeep(createOdataMongoDB(replace(rawQueryString || '', '?', ''), params.query));
    return odataParams;
  }
}
