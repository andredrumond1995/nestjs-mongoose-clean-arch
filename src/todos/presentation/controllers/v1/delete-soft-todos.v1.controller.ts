import { Controller, HttpCode, HttpStatus, Delete, Inject, UseInterceptors, Req } from '@nestjs/common';
import { DeleteSoftTodosV1UsecasePort } from '@todos/domain/ports/usecases/v1/delete-soft-todos.v1.usecase.port';
import { DELETE_SOFT_TODOS_V1_USECASE_TOKEN } from '@todos/infrastructure/module/ioc-tokens/usecases/todos-usecases.ioc.tokens';
import { IExpressRequest } from '@shared/application/types/express.types';
import { MongoDBEndSessionInterceptor } from '@shared/infrastructure/interceptors/database/mongodb-end-session.interceptor';
import { MongoDBStartSessionInterceptor } from '@shared/infrastructure/interceptors/database/mongodb-start-session.interceptor';
import { IDeleteSoftUsecaseOutput } from '@shared/application/types/usecases.types';
import { DeleteSoftController } from '@shared/application/controllers/delete-soft.controller';
import { TodoEntity } from '@shared/application/entities/todo.entity';

@Controller('/v1/todos')
export class DeleteSoftTodosV1Controller extends DeleteSoftController<TodoEntity, IDeleteSoftUsecaseOutput> {
  public constructor(@Inject(DELETE_SOFT_TODOS_V1_USECASE_TOKEN) usecase: DeleteSoftTodosV1UsecasePort) {
    super(usecase);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MongoDBStartSessionInterceptor)
  @UseInterceptors(MongoDBEndSessionInterceptor)
  @Delete('/:id')
  public async controller(@Req() request: IExpressRequest): Promise<IDeleteSoftUsecaseOutput> {
    return super.controller(request);
  }
}
