import { IDeleteSoftUsecaseOutput, IDeleteSoftUsecaseParams, IUsecaseDependencies } from '../types/usecases.types';
import { BaseDeleteSoftUsecase } from './base-delete-soft.usecase';

export class DeleteSoftUsecase<Entity, EntityService> extends BaseDeleteSoftUsecase<Entity, EntityService> {
  public constructor(params: IUsecaseDependencies<EntityService> = {}) {
    super(params);
  }
  protected async execute(params: IDeleteSoftUsecaseParams<Entity>): Promise<IDeleteSoftUsecaseOutput> {
    const { dbSession, closeSessionAfterCommitting, id } = params;

    return this.unitOfWork.withTransaction<IDeleteSoftUsecaseOutput>(
      dbSession!,
      async () => {
        params.documentByIdInDB = await this.checkIfDocumentExistsById(params);
        await this.deleteSoftDocument(params);
        await this.afterAllWriteOperations(params);
        return { id, is_deleted: true };
      },
      closeSessionAfterCommitting,
    );
  }
}
