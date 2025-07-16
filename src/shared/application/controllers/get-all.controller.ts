import { UsecasePort } from '../ports/usecases/use-case.port';
import { IGetAllUsecaseParams } from '../types/usecases.types';
import { IExpressRequest } from '../types/express.types';
import { ClientSession } from 'mongoose';
import { Controller } from './controller';

export abstract class GetAllController<Entity, Output> extends Controller {
  public constructor(protected readonly usecase: UsecasePort<Output, IGetAllUsecaseParams<Entity>>) {
    super();
  }

  protected async controller(request: IExpressRequest): Promise<Output> {
    const rawQueryString = this.getRawQueryString(request);
    const dbSession: ClientSession = this.getDBSession(request);
    const query = this.getQueryFromRequest(request);
    const params: IGetAllUsecaseParams<Entity> = {
      rawQueryString,
      dbSession,
      query,
      request,
    };

    const result = await this.usecase.execute(params);
    return result;
  }
}
