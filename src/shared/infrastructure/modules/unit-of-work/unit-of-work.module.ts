import { Global, Module } from '@nestjs/common';
import { unitOfWorkMQDIProviders } from './di/unit-of-work-di.providers';
import { unitOfWorkDIImports } from './di/unit-of-work-di.imports';
import { unitOfWorkDIExports } from './di/unit-of-work-di.exports';

@Global()
@Module({
  imports: unitOfWorkDIImports,
  providers: unitOfWorkMQDIProviders,
  exports: unitOfWorkDIExports,
})
export class UnitOfWorkModule {}
