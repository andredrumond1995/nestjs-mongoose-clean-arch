import { APP_INTERCEPTOR } from '@nestjs/core';
import { OutgoingRequestLoggingInterceptor } from '@shared/infrastructure/interceptors/outgoing-request-logging.interceptor';
import { SuccessResponseInterceptor } from '@shared/infrastructure/interceptors/success-response.interceptor';
import { IncomingRequestLoggingInterceptor } from '@shared/infrastructure/interceptors/incoming-request-logging.interceptor';
import { ProvidersDI } from '@shared/application/types/di.types';

export const interceptorsDIProviders: ProvidersDI = [
  {
    provide: APP_INTERCEPTOR,
    useClass: IncomingRequestLoggingInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: OutgoingRequestLoggingInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: SuccessResponseInterceptor,
  },
];
