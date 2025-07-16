import { IPaginatedItems } from './pagination.types';

export interface IApiResponsePaginated<T> {
  success: boolean;
  datetime: string;
  httpMethod: string;
  path: string;
  data: IPaginatedItems<T>;
}

export interface IHTTPErrorResponse {
  data: {
    error?: {
      message?: string;
      fieldsWithErrors?: any[];
      [key: string]: any;
    };
  };
  stack?: string;
}

export interface IApiResponse<T> {
  success: boolean;
  datetime: string;
  httpMethod: string;
  path: string;
  data: T;
}

export interface IApiResponseError {
  success: boolean;
  datetime: string;
  httpMethod: string;
  path: string;
  data: IHTTPErrorResponse;
}
