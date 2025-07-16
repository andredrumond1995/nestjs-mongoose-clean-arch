import { TodoEntity } from '@shared/application/entities/todo.entity';
import { UsecasePort } from '@shared/application/ports/usecases/use-case.port';
import { IDeleteSoftUsecaseOutput, IDeleteSoftUsecaseParams } from '@shared/application/types/usecases.types';

export type DeleteSoftTodosV1UsecasePort<
  Output = IDeleteSoftUsecaseOutput,
  Input = IDeleteSoftUsecaseParams<TodoEntity>,
> = UsecasePort<Output, Input>;
