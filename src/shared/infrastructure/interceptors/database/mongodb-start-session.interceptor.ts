import { Injectable, NestInterceptor, Inject, ExecutionContext, CallHandler } from '@nestjs/common';
import { IExpressRequest } from '@shared/application/types/express.types';
import { UNIT_OF_WORK_TOKEN } from '@shared/infrastructure/modules/unit-of-work/ioc-tokens/unit-of-work.ioc.tokens';
import { Observable } from 'rxjs';
import { LOGGER_SERVICE_TOKEN } from '../../modules/shared-services/ioc-tokens/shared-services.ioc.tokens';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work/unit-of-work';
import { ILoggerService } from '@shared/typings/logger.types';

@Injectable()
export class MongoDBStartSessionInterceptor implements NestInterceptor {
  public constructor(
    @Inject(UNIT_OF_WORK_TOKEN) private unitOfWork: UnitOfWork,
    @Inject(LOGGER_SERVICE_TOKEN) private logger: ILoggerService,
  ) {}
  public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<IExpressRequest>();
    const dbSession = await this.unitOfWork.startSession();
    request.db = {
      session: dbSession,
    };

    this.logger.info({
      message: `MongoDB session was started: ${dbSession.id?.id?.toUUID?.() ?? 'unknown'}`,
      context: 'MongoDBStartSessionInterceptor.intercept',
    });

    return next.handle();
  }
}
