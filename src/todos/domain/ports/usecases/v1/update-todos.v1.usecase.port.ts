import { TodoEntity } from '@shared/application/entities/todo.entity';
import { UsecasePort } from '@shared/application/ports/usecases/use-case.port';
import { IUpdateUsecaseParams } from '@shared/application/types/usecases.types';
import { FullPartial } from '@shared/typings/partial.types';

export type UpdateTodosV1UsecasePort<
  Output = FullPartial<TodoEntity>,
  Input = IUpdateUsecaseParams<TodoEntity>,
> = UsecasePort<Output, Input>;
