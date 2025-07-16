import { TodoEntity } from '@shared/application/entities/todo.entity';
import { UsecasePort } from '@shared/application/ports/usecases/use-case.port';
import { IGetByIdUsecaseParams } from '@shared/application/types/usecases.types';
import { FullPartial } from '@shared/typings/partial.types';

export type GetByIdTodosV1UsecasePort<
  Output = FullPartial<TodoEntity>,
  Input = IGetByIdUsecaseParams<TodoEntity>,
> = UsecasePort<Output, Input>;
