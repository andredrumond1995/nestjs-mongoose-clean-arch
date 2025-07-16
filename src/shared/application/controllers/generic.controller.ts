import { UsecasePort } from '../ports/usecases/use-case.port';
import { IExpressRequest } from '../types/express.types';
import { ClientSession } from 'mongoose';
import { Controller } from './controller';
import { RecordAny } from '../types/any.types';
import { IFiles } from '../types/http-request.types';

export abstract class GenericController<Output = RecordAny> extends Controller {
  public constructor(protected readonly usecase: UsecasePort<Output, RecordAny>) {
    super();
  }

  public async controller(request: IExpressRequest): Promise<Output> {
    const rawQueryString = this.getRawQueryString(request);
    const input = request.body as RecordAny;
    const files = request.files as IFiles;
    const dbSession: ClientSession = this.getDBSession(request);
    const query = this.getQueryFromRequest(request);
    const params = {
      rawQueryString,
      dbSession,
      query,
      request,
      input,
      files,
    };

    const result = await this.usecase.execute(params);
    return result;
  }
}
