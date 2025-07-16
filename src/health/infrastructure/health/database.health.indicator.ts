import { Inject, Injectable } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { Connection } from 'mongoose';
import { IHealthIndicator } from '../../application/types/health-indicator.types';
import { MONGODB_DATABASE_NAME } from '@shared/application/constants/mongodb/mongodb-database-names.constants';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator implements IHealthIndicator {
  public constructor(
    @Inject(getConnectionToken(MONGODB_DATABASE_NAME))
    private connection: Connection,
  ) {
    super();
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const databaseState = this.connection.readyState;
      const dbStatus = databaseState === 1;

      return this.getStatus(MONGODB_DATABASE_NAME, dbStatus);
    } catch (error) {
      return this.getStatus(MONGODB_DATABASE_NAME, false, {
        message: error.message,
      });
    }
  }
}
