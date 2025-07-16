import { CreateTodosV1Controller } from '@todos/presentation/controllers/v1/create-todos.v1.controller';
import { DeleteSoftTodosV1Controller } from '@todos/presentation/controllers/v1/delete-soft-todos.v1.controller';
import { GetByIdTodosV1Controller } from '@todos/presentation/controllers/v1/get-by-id-todos.v1.controller';
import { GetAllTodosV1Controller } from '@todos/presentation/controllers/v1/get-all-todos.v1.controller';
import { UpdateTodosV1Controller } from '@todos/presentation/controllers/v1/update-todos.v1.controller';
import { ControllersDI } from '@shared/application/types/di.types';

export const todosDIControllers: ControllersDI = [
  GetByIdTodosV1Controller,
  GetAllTodosV1Controller,
  CreateTodosV1Controller,
  UpdateTodosV1Controller,
  DeleteSoftTodosV1Controller,
];
