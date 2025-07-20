import { map } from 'lodash';
import { generatePagination } from '../utils/pagination.utils';
import { IGetAllUsecaseParams, IUsecaseDependencies } from '../types/usecases.types';
import { IMongooseFindExecItems } from '../types/mongoose.types';

import { ReadUsecase } from './read-usecase';
import { FullPartial } from '@shared/typings/partial.types';
import { IPaginatedItems, IPagination } from '../types/pagination.types';

export class GetAllUsecase<Entity, EntityService> extends ReadUsecase<Entity, EntityService> {
  public constructor(params: IUsecaseDependencies<EntityService> = {}) {
    super(params);
  }
  protected async execute(params: IGetAllUsecaseParams<Entity>): Promise<IPaginatedItems<FullPartial<Entity>[]>> {
    const { dbSession, closeSessionAfterCommitting } = params;

    return this.unitOfWork.withTransaction(
      dbSession!,
      async () => {
        params.odataDBParams = this.getOdataDBParams(params);
        params.itemsFromDB = await this.getAllItems(params);
        params.totalItems = await this.getTotalItems(params);
        params.items = this.getItemsWithVirtuals(params);
        params.items = this.removeSensitiveFieldsFromItems(params);
        params.items = await this.itemsMapper(params);
        params.pagination = this.getPagination(params);
        const result = { ...params.pagination, items: params.items };
        return result;
      },
      closeSessionAfterCommitting,
    ) as unknown as Promise<IPaginatedItems<FullPartial<Entity>[]>>;
  }

  protected async itemsMapper(params: IGetAllUsecaseParams<Entity>): Promise<FullPartial<Entity>[]> {
    return params.items ?? [];
  }

  protected getItemsWithVirtuals(params: IGetAllUsecaseParams<Entity>): FullPartial<Entity>[] {
    const items = map(params.itemsFromDB, (item) =>
      item?.populateVirtuals ? item.populateVirtuals() : item.toJSON(),
    ) as FullPartial<Entity>[];

    return items;
  }

  protected async getAllItems(params: IGetAllUsecaseParams<Entity>): Promise<IMongooseFindExecItems<Entity>> {
    const { odataDBParams = {}, dbSession } = params;
    const items = await this.repository.getAll<Entity>({ odataDBParams, dbSession });

    return items;
  }

  protected getPagination(params: IGetAllUsecaseParams<Entity>): IPagination {
    const { odataDBParams = {}, totalItems, items = [] } = params;
    const pagination = generatePagination(odataDBParams, items, totalItems!);

    return pagination;
  }

  protected async getTotalItems(params: IGetAllUsecaseParams<Entity>): Promise<number> {
    const { odataDBParams = {}, dbSession } = params;
    const totalItems = await this.repository.getTotalItems({ odataDBParams, dbSession });

    return totalItems;
  }
}
