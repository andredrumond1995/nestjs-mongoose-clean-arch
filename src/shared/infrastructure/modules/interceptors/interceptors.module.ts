import { Module } from '@nestjs/common';
import { interceptorsDIProviders } from './di/interceptors-di.providers';
import { interceptorsDIImports } from './di/interceptors-di.imports';

@Module({
  imports: interceptorsDIImports,
  providers: interceptorsDIProviders,
})
export class InterceptorsModule {}
