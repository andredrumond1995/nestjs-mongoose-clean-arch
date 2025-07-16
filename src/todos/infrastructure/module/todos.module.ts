import { Module } from '@nestjs/common';
import { todosDIProviders } from './di/todos-di.providers';
import { todosDIControllers } from './di/todos-di.controllers';
import { todosDIImports } from './di/todos-di.imports';
import { todosDIExports } from './di/todos-di.exports';

@Module({
  imports: todosDIImports,
  controllers: todosDIControllers,
  providers: todosDIProviders,
  exports: todosDIExports,
})
export class TodosModule {}
