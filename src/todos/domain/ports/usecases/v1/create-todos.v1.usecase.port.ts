import { TodoEntity } from '@shared/application/entities/todo.entity';
import { UsecasePort } from '@shared/application/ports/usecases/use-case.port';
import { ICreateUsecaseParams } from '@shared/application/types/usecases.types';
import { FullPartial } from '@shared/typings/partial.types';

export type CreateTodosV1UsecasePort<
  Output = FullPartial<TodoEntity>,
  Input = ICreateUsecaseParams<TodoEntity>,
> = UsecasePort<Output, Input>;
