
export interface IHTTPResponse<T = any> {
  success: boolean;
  datetime: string;
  httpMethod: string;
  path: string;
  data: T;
}

export interface IErrorResponseData {
  stack?: string;
  message?: string
}

export type ISuccessResponse = any | any[];

export type IErrorResponse = IErrorResponseData;

export type IDataHttpResponse = IErrorResponse | ISuccessResponse;
