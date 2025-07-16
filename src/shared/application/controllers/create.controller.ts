import { UsecasePort } from '../ports/usecases/use-case.port';
import { ICreateUsecaseParams } from '../types/usecases.types';
import { IExpressRequest } from '../types/express.types';
import { ClientSession } from 'mongoose';
import { Controller } from './controller';
import { FullPartial } from '@shared/typings/partial.types';
import { IFiles } from '../types/http-request.types';

export abstract class CreateController<Entity, Output = FullPartial<Entity>> extends Controller {
  public constructor(protected readonly usecase: UsecasePort<Output, ICreateUsecaseParams<Entity>>) {
    super();
  }

  protected async controller(request: IExpressRequest): Promise<Output> {
    const dbSession: ClientSession = this.getDBSession(request);
    const input = request.body as FullPartial<Entity>;
    const files = request.files as IFiles;
    const requestMetadata = this.getRequestMetadata(request);
    const params: ICreateUsecaseParams<Entity> = {
      dbSession,
      input,
      files,
      requestMetadata,
      request,
    };

    const result = await this.usecase.execute(params);
    return result;
  }
}
