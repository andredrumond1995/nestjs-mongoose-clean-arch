import { UsecasePort } from '../ports/usecases/use-case.port';
import { IGetAllUsecaseParams, IGetByIdUsecaseParams } from '../types/usecases.types';
import { IExpressRequest } from '../types/express.types';
import { ClientSession } from 'mongoose';
import { Controller } from './controller';

export abstract class GetByIdController<Entity, Output> extends Controller {
  public constructor(protected readonly usecase: UsecasePort<Output, IGetAllUsecaseParams<Entity>>) {
    super();
  }

  protected async controller(request: IExpressRequest): Promise<Output> {
    const rawQueryString = this.getRawQueryString(request);
    const id = this.getIdFromParams(request);
    const query = this.getQueryFromRequest(request);
    const dbSession: ClientSession = this.getDBSession(request);
    const params: IGetByIdUsecaseParams<Entity> = {
      rawQueryString,
      id,
      dbSession,
      query,
      request,
    };

    const result = await this.usecase.execute(params);
    return result;
  }
}
