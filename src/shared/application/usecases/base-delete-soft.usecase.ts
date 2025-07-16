import { UpdateWriteOpResult } from 'mongoose';
import {
  IDeleteSoftManyUsecaseParams,
  IBaseDeleteSoftUsecaseParams,
  IUsecaseDependencies,
} from '../types/usecases.types';
import { IUpdateManyRepositoryResult } from '../types/mongoose.types';
import { WriteUsecase } from './write-usecase';

export class BaseDeleteSoftUsecase<Entity, EntityService> extends WriteUsecase<Entity, EntityService> {
  public constructor(params: IUsecaseDependencies<EntityService> = {}) {
    super(params);
  }

  public async deleteSoftDocument(params: IBaseDeleteSoftUsecaseParams<Entity>): Promise<UpdateWriteOpResult> {
    if (!this.repository?.deleteSoft) {
      throw new Error('Repository or deleteSoft method is not defined');
    }
    return this.repository.deleteSoft(params);
  }

  public async deleteSoftManyDocument(
    params: IDeleteSoftManyUsecaseParams<Entity>,
  ): Promise<IUpdateManyRepositoryResult<Entity>> {
    if (!this.repository?.deleteSoftMany) {
      throw new Error('Repository or deleteSoftMany method is not defined');
    }
    return this.repository.deleteSoftMany(params);
  }
}
