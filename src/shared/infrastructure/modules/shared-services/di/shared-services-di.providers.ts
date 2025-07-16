import { ApiResponseService } from '@shared/application/services/api-response/api-response.service';
import { ProvidersDI } from '@shared/application/types/di.types';
import {
  AXIOS_SERVICE_TOKEN,
  HTTP_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
} from '../ioc-tokens/shared-services.ioc.tokens';
import { LoggerService } from '@shared/services/logger.service';
import { AxiosService } from '@shared/services/axios.service';
import { ILoggerService } from '@shared/typings/logger.types';

export const sharedServicesDIProviders: ProvidersDI = [
  { provide: HTTP_SERVICE_TOKEN, useClass: ApiResponseService },
  {
    provide: LOGGER_SERVICE_TOKEN,
    useFactory: (): LoggerService => {
      const appName = process.env.APP_NAME || 'test-app';
      return new LoggerService(appName);
    },
  },
  {
    provide: AXIOS_SERVICE_TOKEN,
    useFactory: (logger: ILoggerService): AxiosService => {
      return new AxiosService(logger);
    },
    inject: [LOGGER_SERVICE_TOKEN],
  },
];
