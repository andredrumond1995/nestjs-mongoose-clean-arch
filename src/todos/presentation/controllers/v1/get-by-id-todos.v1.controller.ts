import { Controller, HttpCode, HttpStatus, Get, Inject, Req } from '@nestjs/common';
import { GetByIdTodosV1UsecasePort } from '@todos/domain/ports/usecases/v1/get-by-id-todos.v1.usecase.port';
import { GET_BY_ID_TODOS_V1_USECASE_TOKEN } from '@todos/infrastructure/module/ioc-tokens/usecases/todos-usecases.ioc.tokens';
import { GetByIdController } from '@shared/application/controllers/get-by-id.controller';
import { IExpressRequest } from '@shared/application/types/express.types';
import { TodoEntity } from '@shared/application/entities/todo.entity';
import { FullPartial } from '@shared/typings/partial.types';

@Controller('/v1/todos')
export class GetByIdTodosV1Controller extends GetByIdController<TodoEntity, FullPartial<TodoEntity>> {
  public constructor(@Inject(GET_BY_ID_TODOS_V1_USECASE_TOKEN) usecase: GetByIdTodosV1UsecasePort) {
    super(usecase);
  }
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  public async controller(@Req() request: IExpressRequest): Promise<FullPartial<TodoEntity>> {
    return super.controller(request);
  }
}
