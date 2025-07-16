import { UsecasePort } from '../ports/usecases/use-case.port';
import { ObjectId } from 'bson';
import { IExpressRequest } from '../types/express.types';
import { Controller } from './controller';
import { ClientSession } from 'mongoose';
import { get } from 'lodash';
import { IDeleteSoftUsecaseParams } from '../types/usecases.types';

export abstract class DeleteSoftController<Entity, Output> extends Controller {
  public constructor(protected readonly usecase: UsecasePort<Output, IDeleteSoftUsecaseParams<Entity>>) {
    super();
  }

  protected async controller(request: IExpressRequest): Promise<Output> {
    const idParsed = new ObjectId(request.params.id);
    const dbSession: ClientSession = this.getDBSession(request);
    const cascadeCleanupOrphanedRefs: boolean = get(request, 'body.cascadeCleanupOrphanedRefs', false);
    const requestMetadata = this.getRequestMetadata(request);
    const params: IDeleteSoftUsecaseParams<Entity> = {
      dbSession,
      id: idParsed,
      cascadeCleanupOrphanedRefs,
      requestMetadata,
      request,
    };

    const result = await this.usecase.execute(params);
    return result;
  }
}
