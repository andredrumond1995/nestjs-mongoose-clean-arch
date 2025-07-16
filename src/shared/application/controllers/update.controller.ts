import { UsecasePort } from '../ports/usecases/use-case.port';
import { IUpdateUsecaseParams } from '../types/usecases.types';
import { ObjectId } from 'bson';
import { IExpressRequest } from '../types/express.types';
import { ClientSession } from 'mongoose';
import { Controller } from './controller';
import { FullPartial } from '@shared/typings/partial.types';
import { IFiles } from '../types/http-request.types';

export abstract class UpdateController<Entity, Output> extends Controller {
  public constructor(protected readonly usecase: UsecasePort<Output, IUpdateUsecaseParams<Entity>>) {
    super();
  }

  protected async controller(request: IExpressRequest): Promise<Output> {
    const input = request.body as FullPartial<Entity>;
    const id = new ObjectId(request.params.id);
    const files = request.files as IFiles;
    const dbSession: ClientSession = this.getDBSession(request);
    const requestMetadata = this.getRequestMetadata(request);
    const params: IUpdateUsecaseParams<Entity> = {
      dbSession,
      input,
      id,
      files,
      requestMetadata,
      request,
    };

    const result = await this.usecase.execute(params);
    return result;
  }
}
