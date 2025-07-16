import { first, isEmpty } from 'lodash';
import { IMongooseFindExecItem } from '../types/mongoose.types';
import { IGetByIdUsecaseParams, IUsecaseDependencies } from '../types/usecases.types';
import { ReadUsecase } from './read-usecase';
import { FullPartial } from '@shared/typings/partial.types';

export class GetByIdUsecase<Entity, EntityService> extends ReadUsecase<Entity, EntityService> {
  public constructor(params: IUsecaseDependencies<EntityService> = {}) {
    super(params);
  }
  protected async execute(params: IGetByIdUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    const { dbSession, closeSessionAfterCommitting } = params;

    return this.unitOfWork.withTransaction<FullPartial<Entity>>(
      dbSession!,
      async () => {
        params.odataDBParams = this.getOdataDBParams(params);
        params.itemFromDB = await this.getItem(params);
        params.item = await this.getItemWithVirtuals(params);
        params.item = this.removeSensitiveFieldsFromItem(params);
        params.item = await this.itemMapper(params);
        return params.item;
      },
      closeSessionAfterCommitting,
    );
  }

  protected removeSensitiveFieldsFromItem(params: IGetByIdUsecaseParams<Entity>): FullPartial<Entity> {
    if (isEmpty(params.item)) return {};
    const items = super.removeSensitiveFieldsFromItems(params);
    const item = first(items);
    return item as FullPartial<Entity>;
  }

  protected async itemMapper(params: IGetByIdUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    return params.item!;
  }

  protected getItemWithVirtuals(params: IGetByIdUsecaseParams<Entity>): FullPartial<Entity> {
    const { itemFromDB } = params;
    if (isEmpty(itemFromDB)) return {};
    if (!itemFromDB) return {};
    const item = itemFromDB.populateVirtuals
      ? itemFromDB.populateVirtuals()
      : (itemFromDB.toJSON() as FullPartial<Entity>);

    return item;
  }

  protected async getItem(params: IGetByIdUsecaseParams<Entity>): Promise<IMongooseFindExecItem<Entity>> {
    if (!this.repository.getById) throw new Error('getById not implemented');
    const { odataDBParams, dbSession, id } = params;
    const item = await this.repository.getById<Entity>({ odataDBParams, dbSession, id });

    return item as unknown as IMongooseFindExecItem<Entity>;
  }
}
