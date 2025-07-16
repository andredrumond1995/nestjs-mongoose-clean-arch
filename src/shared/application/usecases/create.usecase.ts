import { ICreateUsecaseParams, IUsecaseDependencies } from '../types/usecases.types';
import { first } from 'lodash';
import { WriteUsecase } from './write-usecase';
import { FullPartial } from '@shared/typings/partial.types';
export class CreateUsecase<Entity, EntityService> extends WriteUsecase<Entity, EntityService> {
  public constructor(params: IUsecaseDependencies<EntityService> = {}) {
    super(params);
  }
  public async execute(params: ICreateUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    const { dbSession, closeSessionAfterCommitting } = params;

    return this.unitOfWork.withTransaction<FullPartial<Entity>>(
      dbSession!,
      async () => {
        await this.checkInputUniqueness(params);
        params.createdDocument = await this.createDocument(params);
        params.createdDocument = first(this.removeSensitiveFieldsFromResult(params));
        await this.afterAllWriteOperations(params);
        return this.getCreatedDocument(params);
      },
      closeSessionAfterCommitting,
    );
  }

  protected async createDocument(params: ICreateUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    return this.repository.create<Entity>(params);
  }
}
