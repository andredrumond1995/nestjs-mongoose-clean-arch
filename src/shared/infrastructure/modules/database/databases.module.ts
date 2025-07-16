import { Module } from '@nestjs/common';
import { databasesDIImports } from './di/databases-di.imports';
import { databasesDIProviders } from './di/databases-di.providers';
import { databasesDIExports } from './di/databases-di.exports';

@Module({
  imports: databasesDIImports,
  providers: databasesDIProviders,
  exports: databasesDIExports,
})
export class DatabasesModule {}
