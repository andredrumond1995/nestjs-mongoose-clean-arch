import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';
import { IHealthIndicator } from '../../application/types/health-indicator.types';
import { every, get, omit } from 'lodash';
import {
  DATABASE_HEALTH_INDICATOR,
} from '../../infrastructure/module/ioc-tokens/health-database.ioc.tokens';

@Controller('health')
export class HealthCheckController {
  public constructor(
    private health: HealthCheckService,
    @Inject(DATABASE_HEALTH_INDICATOR)
    private walletSyncDatabaseHealthIndicator: IHealthIndicator,
  ) {}
  @HealthCheck()
  @Get()
  public async check(): Promise<HealthCheckResult> {
    const checks = await this.health.check([
      (): Promise<HealthIndicatorResult> => this.walletSyncDatabaseHealthIndicator.isHealthy(),
    ]);

    const allChecksUp = every(get(checks, 'details'), { status: 'up' });

    if (!allChecksUp) checks.status = 'error';

    return omit(checks, 'info');
  }
}
