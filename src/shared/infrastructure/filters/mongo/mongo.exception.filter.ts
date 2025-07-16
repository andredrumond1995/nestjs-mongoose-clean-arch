import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Inject } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';
import { duplicatedKeyErrorHelper } from './helpers/mongo-duplicated-key.error.helper';
import {
  MONGO_DUPLICATED_KEY_EXCEPTION_CODE,
  MONGO_PATH_COLLISION,
} from '@shared/application/constants/filters/mongo.exception.filter.codes';
import { IErrorResponseData } from '@shared/application/services/api-response/types/http.service.types';
import {
  HTTP_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
} from '@shared/infrastructure/modules/shared-services/ioc-tokens/shared-services.ioc.tokens';
import { ApiResponseService } from '@shared/application/services/api-response/api-response.service';
import { pathCollisionErrorHelper } from './helpers/mongo-path-collision.error.helper';
import { API_EVENTS } from '@shared/application/constants/logging-events.constants';
import { ILoggerService } from '@shared/typings/logger.types';

interface IExceptionHandler {
  errorMessageGenerator: (exception: MongoError, request: Request) => string;
  status: number;
}

interface IMapperHandler {
  [code: number]: IExceptionHandler;
}

const MAPPER_HANDLER: IMapperHandler = {
  [MONGO_DUPLICATED_KEY_EXCEPTION_CODE]: {
    errorMessageGenerator: duplicatedKeyErrorHelper,
    status: HttpStatus.BAD_REQUEST,
  },
  [MONGO_PATH_COLLISION]: {
    errorMessageGenerator: pathCollisionErrorHelper,
    status: HttpStatus.BAD_REQUEST,
  },
};
@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  public constructor(
    @Inject(HTTP_SERVICE_TOKEN)
    private apiResponseService: ApiResponseService,
    @Inject(LOGGER_SERVICE_TOKEN)
    private logger: ILoggerService,
  ) {}
  public catch(exception: MongoError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();

    const handler: IExceptionHandler | undefined = MAPPER_HANDLER[exception.code as keyof typeof MAPPER_HANDLER];

    if (handler) {
      const message = handler.errorMessageGenerator(exception, request);
      const status = handler.status;
      const error: IErrorResponseData = {
        stack: exception.stack,
        message,
      };
      const data = this.apiResponseService.generateResponse(request, false, error);

      this.logger.error({
        event: API_EVENTS.MONGODB_ERROR,
        context: 'MongoExceptionFilter.catch',
        message: error.message,
        data: error.stack,
      });
      response.status(status).json(data);
    }
  }
}
