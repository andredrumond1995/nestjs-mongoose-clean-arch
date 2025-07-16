import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LOGGER_SERVICE_TOKEN } from '../modules/shared-services/ioc-tokens/shared-services.ioc.tokens';
import { API_EVENTS } from '@shared/application/constants/logging-events.constants';
import { ILoggerService } from '@shared/typings/logger.types';

@Injectable()
export class OutgoingRequestLoggingInterceptor implements NestInterceptor {
  public constructor(@Inject(LOGGER_SERVICE_TOKEN) private logger: ILoggerService) {}
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [request] = context.getArgs();
    const loggingData = {
      url: request.url,
      path: request.path,
      method: request.method,
      ip: request.ip,
    };

    return next.handle().pipe(
      tap((response) => {
        this.logger.info({
          message: 'Logging when request ends',
          data: { ...loggingData, response },
          context: `${context.getClass().name}.${context.getHandler().name}`,
          event: API_EVENTS.OUTGOING_REQUEST,
        });
      }),
    );
  }
}
