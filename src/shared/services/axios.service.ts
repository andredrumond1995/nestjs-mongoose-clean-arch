import { ILoggerService } from '@shared/typings/logger.types';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { omit } from 'lodash';

export class AxiosService {
  private axiosInstance: AxiosInstance;

  public constructor(
    private logger: ILoggerService,
    baseURL?: string,
    headers?: Record<string, string>,
  ) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      headers: headers,
    });

    this.initializeResponseInterceptor();
  }

  private initializeResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(this.handleResponse, this.handleError);
  }

  private handleResponse(response: AxiosResponse): any {
    return response?.data;
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error);
  }

  public setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public setHeader(name: string, value: string | number): void {
    this.axiosInstance.defaults.headers.common[name] = value;
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    this.logger.info({
      event: 'axios_service_get',
      message: '[get] method was triggered',
      data: { url, config },
      context: 'AxiosInstance.get',
    });
    return this.axiosInstance.get(url, config);
  }

  public post<T, P = any>(url: string, data?: P, config?: AxiosRequestConfig): Promise<T> {
    this.logger.info({
      event: 'axios_service_post',
      message: '[post] method was triggered',
      data: { url, config, payload: omit(data as any, ['password']) },
      context: 'AxiosInstance.post',
    });
    return this.axiosInstance.post(url, data, config);
  }

  public put<T, P = any>(url: string, data?: P, config?: AxiosRequestConfig): Promise<T> {
    this.logger.info({
      event: 'axios_service_put',
      message: '[put] method was triggered',
      data: { url, config, payload: omit(data as any, ['password']) },
      context: 'AxiosInstance.put',
    });
    return this.axiosInstance.put(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    this.logger.info({
      event: 'axios_service_delete',
      message: '[delete] method was triggered',
      data: { url, config },
      context: 'AxiosInstance.delete',
    });
    return this.axiosInstance.delete(url, config);
  }

  public requestWithParams<T>(config: AxiosRequestConfig): Promise<T> {
    this.logger.info({
      event: 'axios_service_request_with_params',
      message: '[requestWithParams] method was triggered',
      data: { ...config, data: omit(config?.data, ['password']) },
      context: 'AxiosInstance.requestWithParams',
    });
    return this.axiosInstance.request(config);
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
