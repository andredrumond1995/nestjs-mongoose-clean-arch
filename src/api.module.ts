import { Module } from '@nestjs/common';
import { AppConfigModule } from '@shared/infrastructure/modules/app-config/app.config.module';
import { DatabasesModule } from '@shared/infrastructure/modules/database/databases.module';
import { FiltersModule } from '@shared/infrastructure/modules/filters/filters.module';
import { InterceptorsModule } from '@shared/infrastructure/modules/interceptors/interceptors.module';
import { SharedServicesModule } from '@shared/infrastructure/modules/shared-services/shared.services.module';
import { TodosModule } from './todos/infrastructure/module/todos.module';
import { HealthModule } from './health/infrastructure/module/health.module';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work/unit-of-work';

@Module({
  imports: [
    AppConfigModule,
    SharedServicesModule,
    UnitOfWork,
    DatabasesModule,
    HealthModule,
    TodosModule,
    FiltersModule,
    InterceptorsModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
