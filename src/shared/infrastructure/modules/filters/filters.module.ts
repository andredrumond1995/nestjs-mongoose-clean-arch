import { Module } from '@nestjs/common';
import { filtersDIProviders } from './di/filters-di.providers';
import { filtersDIImports } from './di/filters-di.imports';

@Module({
  imports: filtersDIImports,
  providers: filtersDIProviders,
})
export class FiltersModule {}
