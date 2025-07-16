import { UsecasePort } from '@shared/application/ports/usecases/use-case.port';
import { IPaginatedItems } from '@shared/application/types/pagination.types';
import { TodoEntity } from '@shared/application/entities/todo.entity';
import { FullPartial } from '@shared/typings/partial.types';
import { IGetAllUsecaseParams } from '@shared/application/types/usecases.types';

export type GetAllTodosV1UsecasePort<
  Output = IPaginatedItems<FullPartial<TodoEntity>[]>,
  Input = IGetAllUsecaseParams<TodoEntity>,
> = UsecasePort<Output, Input>;
