import { IPaginatedItems } from '@shared/application/types/pagination.types';
import { GetAllTodosV1UsecasePort } from '@todos/domain/ports/usecases/v1/get-all-todos.v1.usecase.port';
import { GET_ALL_TODOS_V1_USECASE_TOKEN } from '@todos/infrastructure/module/ioc-tokens/usecases/todos-usecases.ioc.tokens';
import { Controller, HttpCode, HttpStatus, Get, Inject, Req } from '@nestjs/common';
import { GetAllController } from '@shared/application/controllers/get-all.controller';
import { IExpressRequest } from '@shared/application/types/express.types';
import { FullPartial } from '@shared/typings/partial.types';
import { TodoEntity } from '@shared/application/entities/todo.entity';

@Controller('/v1/todos')
export class GetAllTodosV1Controller extends GetAllController<TodoEntity, IPaginatedItems<FullPartial<TodoEntity[]>>> {
  public constructor(@Inject(GET_ALL_TODOS_V1_USECASE_TOKEN) usecase: GetAllTodosV1UsecasePort) {
    super(usecase);
  }
  @HttpCode(HttpStatus.OK)
  @Get('/')
  public async controller(@Req() request: IExpressRequest): Promise<IPaginatedItems<FullPartial<TodoEntity[]>>> {
    return super.controller(request);
  }
}
