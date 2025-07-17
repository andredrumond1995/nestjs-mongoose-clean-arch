import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Inject, HttpStatus } from '@nestjs/common';
import { API_EVENTS } from '@shared/application/constants/logging-events.constants';
import { ApiResponseService } from '@shared/application/services/api-response/api-response.service';
import { IErrorResponseData } from '@shared/application/services/api-response/types/api-response.service.types';
import {
  HTTP_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
} from '@shared/infrastructure/modules/shared-services/ioc-tokens/shared-services.ioc.tokens';
import { RecordAny } from '@shared/typings/any.types';
import { ILoggerService } from '@shared/typings/logger.types';
import { Request, Response } from 'express';
import { defaultTo, get, invoke } from 'lodash';

@Catch()
export class GenericExceptionFilter implements ExceptionFilter {
  public constructor(
    @Inject(HTTP_SERVICE_TOKEN)
    private apiResponseService: ApiResponseService,
    @Inject(LOGGER_SERVICE_TOKEN) private logger: ILoggerService,
  ) {}

  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = defaultTo(invoke(exception, 'getStatus'), HttpStatus.INTERNAL_SERVER_ERROR);
    const stack = exception.stack;
    const error: IErrorResponseData = {
      stack,
      message: exception.message,
    };
    const data = this.apiResponseService.generateResponse(request, false, error);

    this.logger.error({
      event: API_EVENTS.ERROR,
      context: 'GenericExceptionFilter.catch',
      message: exception.message,
      data: {
        stack,
      },
      errors: [error],
    });

    response.status(status).json(data);
  }
}
