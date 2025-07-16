import { ProvidersDI } from '@shared/application/types/di.types';
import { DATABASE_HEALTH_INDICATOR } from '../ioc-tokens/health-database.ioc.tokens';
import { DatabaseHealthIndicator } from '../../health/database.health.indicator';

export const healthDIProviders: ProvidersDI = [
  {
    provide: DATABASE_HEALTH_INDICATOR,
    useClass: DatabaseHealthIndicator,
  },
];
