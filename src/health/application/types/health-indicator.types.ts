import { HealthIndicatorResult } from '@nestjs/terminus';

export interface IHealthIndicator {
  isHealthy: (key?: string) => Promise<HealthIndicatorResult>;
}
