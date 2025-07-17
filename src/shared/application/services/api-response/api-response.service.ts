import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { IDataHttpResponse, IHTTPResponse } from './types/api-response.service.types';
import { formatDatetime } from '@shared/utils/datetime.utils';
@Injectable()
export class ApiResponseService {
  public generateResponse(req: Request, success: boolean, data: IDataHttpResponse): IHTTPResponse {
    if (process.env.NODE_ENV === 'production') delete data.stack;

    const datetime = formatDatetime({ value: new Date() });
    const httpMethod = req.method;
    const path = req.path;
    const response = {
      success,
      datetime,
      httpMethod,
      path,
      data,
    };

    return response as IHTTPResponse;
  }
}
