import { FullPartial } from '@shared/typings/partial.types';
import { IUpdateUsecaseParams, IUsecaseDependencies } from '../types/usecases.types';
import { WriteUsecase } from './write-usecase';

export class UpdateUsecase<Entity, EntityService = any> extends WriteUsecase<Entity, EntityService> {
  public constructor(params: IUsecaseDependencies<EntityService> = {}) {
    super(params);
  }
  public async execute(params: IUpdateUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    const { dbSession, closeSessionAfterCommitting } = params;

    return this.unitOfWork.withTransaction<FullPartial<Entity>>(
      dbSession!,
      async () => {
        params.documentByIdInDB = await this.checkIfDocumentExistsById(params);
        params.inputValidated = await this.removeFieldsToNotSave(params);
        await this.updateDocument(params);
        await this.afterAllWriteOperations(params);
        return this.getUpdatedDocument(params);
      },
      closeSessionAfterCommitting,
    );
  }

  protected async updateDocument(params: IUpdateUsecaseParams<Entity>): Promise<void> {
    await this.repository.update<Entity>(params);
  }

  protected async getUpdatedDocument(
    params: IUpdateUsecaseParams<Entity>,
    rawQueryString: string = '$include_deleted=true',
  ): Promise<FullPartial<Entity>> {
    return this.getDocumentById(params, rawQueryString);
  }
}
