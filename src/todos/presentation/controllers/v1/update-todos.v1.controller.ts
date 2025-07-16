import { Controller, HttpCode, HttpStatus, Put, Inject, UseInterceptors, Req } from '@nestjs/common';
import { UpdateTodosV1UsecasePort } from '@todos/domain/ports/usecases/v1/update-todos.v1.usecase.port';
import { UPDATE_TODOS_V1_USECASE_TOKEN } from '@todos/infrastructure/module/ioc-tokens/usecases/todos-usecases.ioc.tokens';
import { IExpressRequest } from '@shared/application/types/express.types';
import { MongoDBEndSessionInterceptor } from '@shared/infrastructure/interceptors/database/mongodb-end-session.interceptor';
import { MongoDBStartSessionInterceptor } from '@shared/infrastructure/interceptors/database/mongodb-start-session.interceptor';
import { UpdateController } from '@shared/application/controllers/update.controller';
import { FullPartial } from '@shared/typings/partial.types';
import { TodoEntity } from '@shared/application/entities/todo.entity';

@Controller('/v1/todos')
export class UpdateTodosV1Controller extends UpdateController<TodoEntity, FullPartial<TodoEntity>> {
  public constructor(@Inject(UPDATE_TODOS_V1_USECASE_TOKEN) usecase: UpdateTodosV1UsecasePort) {
    super(usecase);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MongoDBStartSessionInterceptor)
  @UseInterceptors(MongoDBEndSessionInterceptor)
  @Put('/:id')
  public async controller(@Req() request: IExpressRequest): Promise<FullPartial<TodoEntity>> {
    return super.controller(request);
  }
}
