import { ExceptionFilter, Catch, NotFoundException, ArgumentsHost, HttpStatus, Inject } from '@nestjs/common';
import { API_EVENTS } from '@shared/application/constants/logging-events.constants';
import { DocumentNotFoundByIdException } from '@shared/application/exceptions/document-not-found-by-id.exception';
import { ApiResponseService } from '@shared/application/services/api-response/api-response.service';
import { IExceptionParams } from '@shared/application/types/exception.params.types';
import {
  HTTP_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
} from '@shared/infrastructure/modules/shared-services/ioc-tokens/shared-services.ioc.tokens';
import { IHTTPErrorResponse } from '@shared/typings/http.service.types';
import { ILoggerService } from '@shared/typings/logger.types';
import { Request, Response } from 'express';

@Catch(DocumentNotFoundByIdException)
export class DocumentNotFoundByIdExceptionFilter implements ExceptionFilter {
  public constructor(
    @Inject(HTTP_SERVICE_TOKEN)
    private apiResponseService: ApiResponseService,
    @Inject(LOGGER_SERVICE_TOKEN) private logger: ILoggerService,
  ) {}
  public catch(exception: NotFoundException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const stack = exception.stack;
    const errorData: IExceptionParams = JSON.parse(exception.message);
    const message = errorData.message;
    const error: IHTTPErrorResponse = {
      stack,
      data: {
        error: {
          message,
        },
      },
    };
    const data = this.apiResponseService.generateResponse(request, false, error);

    this.logger.error({
      event: API_EVENTS.ERROR,
      context: 'DocumentNotFoundByIdExceptionFilter.catch',
      message,
      data: {
        stack,
      },
    });

    response.status(HttpStatus.NOT_FOUND).json(data);
  }
}
