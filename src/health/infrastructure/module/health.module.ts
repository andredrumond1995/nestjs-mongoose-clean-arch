import { Module } from '@nestjs/common';
import { healthDIControllers } from './di/health-di.controllers';
import { healthDIProviders } from './di/health-di.providers';
import { healthDIImports } from './di/health-di.imports';

@Module({
  imports: healthDIImports,
  controllers: healthDIControllers,
  providers: healthDIProviders,
})
export class HealthModule {}
