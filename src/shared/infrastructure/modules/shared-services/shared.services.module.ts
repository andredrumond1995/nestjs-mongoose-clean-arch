import { Global, Module } from '@nestjs/common';
import { sharedServicesDIProviders } from './di/shared-services-di.providers';
import { sharedServicesDIExports } from './di/shared-services-di.exports';
import { sharedServicesDIImports } from './di/shared-services-di.imports';

@Global()
@Module({
  imports: sharedServicesDIImports,
  providers: sharedServicesDIProviders,
  exports: sharedServicesDIExports,
})
export class SharedServicesModule {}
