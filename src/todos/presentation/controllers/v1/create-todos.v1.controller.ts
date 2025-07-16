import { Controller, HttpCode, HttpStatus, Post, Inject, UseInterceptors, Req } from '@nestjs/common';
import { CREATE_TODOS_V1_USECASE_TOKEN } from '@todos/infrastructure/module/ioc-tokens/usecases/todos-usecases.ioc.tokens';
import { IExpressRequest } from '@shared/application/types/express.types';
import { MongoDBEndSessionInterceptor } from '@shared/infrastructure/interceptors/database/mongodb-end-session.interceptor';
import { MongoDBStartSessionInterceptor } from '@shared/infrastructure/interceptors/database/mongodb-start-session.interceptor';
import { CreateController } from '@shared/application/controllers/create.controller';
import { CreateTodosV1UsecasePort } from '@todos/domain/ports/usecases/v1/create-todos.v1.usecase.port';
import { FullPartial } from '@shared/typings/partial.types';
import { TodoEntity } from '@shared/application/entities/todo.entity';

@Controller('/v1/todos')
export class CreateTodosV1Controller extends CreateController<TodoEntity> {
  public constructor(@Inject(CREATE_TODOS_V1_USECASE_TOKEN) usecase: CreateTodosV1UsecasePort) {
    super(usecase);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(MongoDBStartSessionInterceptor)
  @UseInterceptors(MongoDBEndSessionInterceptor)
  @Post('/')
  public async controller(@Req() request: IExpressRequest): Promise<FullPartial<TodoEntity>> {
    return super.controller(request);
  }
}
