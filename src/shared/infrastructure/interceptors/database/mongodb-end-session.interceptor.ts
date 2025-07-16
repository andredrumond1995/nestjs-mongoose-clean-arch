import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { IExpressRequest } from '@shared/application/types/express.types';
import { LOGGER_SERVICE_TOKEN } from '@shared/infrastructure/modules/shared-services/ioc-tokens/shared-services.ioc.tokens';
import { ILoggerService } from '@shared/typings/logger.types';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class MongoDBEndSessionInterceptor implements NestInterceptor {
  public constructor(@Inject(LOGGER_SERVICE_TOKEN) private logger: ILoggerService) {}
  public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    return next.handle().pipe(
      finalize(() => {
        const request = context.switchToHttp().getRequest<IExpressRequest>();
        const dbSession = request.db?.session;
        if (!dbSession?.hasEnded && dbSession?.inTransaction()) {
          dbSession.commitTransaction().then(() => dbSession?.endSession());
        }

        this.logger.info({
          message: `MongoDB dbSession is correctly closed: ${dbSession?.id?.id?.toUUID()}`,
          context: 'MongoDBEndSessionInterceptor.intercept',
        });
      }),
    );
  }
}
