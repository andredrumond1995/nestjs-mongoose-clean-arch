import { get } from 'lodash';
import { IRequestMetadata } from '../types/usecases.types';
import { ObjectId } from 'bson';
import { IExpressRequest } from '../types/express.types';
import { ClientSession } from 'mongoose';
import QueryString from 'qs';

export abstract class Controller {
  public constructor() {}

  protected getIdFromParams(request: IExpressRequest): ObjectId {
    return new ObjectId(get(request, 'params.id'));
  }

  protected getRequestMetadata(request: IExpressRequest): IRequestMetadata {
    const getHeader = (name: string): string | undefined => {
      const value = request.headers[name];
      return value !== undefined ? value.toString() : undefined;
    };

    const ipAddress = (
      getHeader('x-forwarded-for')?.split(',')[0]?.trim() ||
      getHeader('cf-connecting-ip') ||
      request.socket?.remoteAddress ||
      request.ip
    )?.replace(/^::ffff:/, '');

    const fullUrl = request.originalUrl || request.url;
    const endpoint = fullUrl?.split('?')[0];

    return {
      ipAddress,
      userAgent: getHeader('user-agent'),
      method: request.method,
      url: fullUrl,
      endpoint,
      origin: getHeader('origin'),
      headers: request.headers,
      queryParams: request.query,
      body: request.body,
      host: getHeader('host'),
      referrer: getHeader('referer'),
    };
  }

  protected getRawQueryString(request: IExpressRequest): string {
    return request.url.split('?')[1] || '';
  }

  protected getDBSession(request: IExpressRequest): ClientSession {
    return request?.db?.session as ClientSession;
  }

  protected getQueryFromRequest(request: IExpressRequest): QueryString.ParsedQs {
    return get(request, 'query');
  }
}
