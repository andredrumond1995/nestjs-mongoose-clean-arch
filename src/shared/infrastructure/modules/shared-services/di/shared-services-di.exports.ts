import { ExportsDI } from '@shared/application/types/di.types';
import {
  AXIOS_SERVICE_TOKEN,
  HTTP_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
} from '../ioc-tokens/shared-services.ioc.tokens';

export const sharedServicesDIExports: ExportsDI = [
  HTTP_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
  AXIOS_SERVICE_TOKEN,
];
