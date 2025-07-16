import { Injectable, NestInterceptor, ExecutionContext, Inject, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LOGGER_SERVICE_TOKEN } from '../modules/shared-services/ioc-tokens/shared-services.ioc.tokens';
import { get, isEmpty, pick } from 'lodash';
import { API_EVENTS } from '@shared/application/constants/logging-events.constants';
import { ILoggerService } from '@shared/typings/logger.types';

@Injectable()
export class IncomingRequestLoggingInterceptor implements NestInterceptor {
  public constructor(@Inject(LOGGER_SERVICE_TOKEN) private logger: ILoggerService) {}
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [request] = context.getArgs();

    const loggingData = {
      path: request.path,
      url: request.url,
      method: request.method,
      ip: request.headers['x-forwarded-for'] || request.connection?.remoteAddress,
      query: get(request, 'query', {}),
      body: get(request, 'body', {}),
      params: get(request, 'params', {}),
    };

    const user = pick(get(request, 'user.user'), ['_id', 'name', 'last_name']);

    if (!isEmpty(user)) loggingData['user'] = user;

    this.logger.info({
      message: 'Logging when request starts',
      data: loggingData,
      context: `${context.getClass().name}.${context.getHandler().name}`,
      event: API_EVENTS.INCOMING_REQUEST,
    });

    return next.handle();
  }
}
