import { ExceptionFilter, Catch, NotFoundException, ArgumentsHost, HttpStatus, Inject } from '@nestjs/common';
import { API_EVENTS } from '@shared/application/constants/logging-events.constants';
import { ApiResponseService } from '@shared/application/services/api-response/api-response.service';
import { IErrorResponseData } from '@shared/application/services/api-response/types/api-response.service.types';
import {
  HTTP_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
} from '@shared/infrastructure/modules/shared-services/ioc-tokens/shared-services.ioc.tokens';
import { ILoggerService } from '@shared/typings/logger.types';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NotFoundRouteExceptionFilter implements ExceptionFilter {
  public constructor(
    @Inject(HTTP_SERVICE_TOKEN)
    private apiResponseService: ApiResponseService,
    @Inject(LOGGER_SERVICE_TOKEN) private logger: ILoggerService,
  ) {}
  public catch(exception: NotFoundException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const stack = exception.stack;
    const message = exception.message || `Not found route: ${request.path}`;
    const error: IErrorResponseData = {
      stack,
      message,
    };
    const data = this.apiResponseService.generateResponse(request, false, error);

    this.logger.error({
      event: API_EVENTS.ERROR,
      context: 'NotFoundRouteExceptionFilter.catch',
      message,
      data: {
        stack,
      },
    });

    response.status(HttpStatus.NOT_FOUND).json(data);
  }
}
