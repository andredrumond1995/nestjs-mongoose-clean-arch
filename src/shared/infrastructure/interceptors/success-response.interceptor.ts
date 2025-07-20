import { Injectable, NestInterceptor, Inject, ExecutionContext, CallHandler } from '@nestjs/common';
import { ApiResponseService } from '@shared/application/services/api-response/api-response.service';
import {
  IDataHttpResponse,
  IHTTPResponse,
} from '@shared/application/services/api-response/types/api-response.service.types';
import { HTTP_SERVICE_TOKEN } from '@shared/infrastructure/modules/shared-services/ioc-tokens/shared-services.ioc.tokens';
import { Observable, map } from 'rxjs';
import { IExpressRequest } from '@shared/application/types/express.types';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  public constructor(
    @Inject(HTTP_SERVICE_TOKEN)
    private apiResponseService: ApiResponseService,
  ) {}
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: IDataHttpResponse): IHTTPResponse => {
        const request = context.switchToHttp().getRequest<IExpressRequest>();
        const successResponse: IHTTPResponse = this.apiResponseService.generateResponse(request, true, data);
        return successResponse;
      }),
    );
  }
}
