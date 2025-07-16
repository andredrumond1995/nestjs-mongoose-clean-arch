import { ProvidersDI } from '@shared/application/types/di.types';
import {
  CREATE_TODOS_V1_USECASE_TOKEN,
  DELETE_SOFT_TODOS_V1_USECASE_TOKEN,
  GET_ALL_TODOS_V1_USECASE_TOKEN,
  GET_BY_ID_TODOS_V1_USECASE_TOKEN,
  UPDATE_TODOS_V1_USECASE_TOKEN,
} from '../ioc-tokens/usecases/todos-usecases.ioc.tokens';
import { CreateTodosV1Usecase } from '@todos/application/usecases/v1/create-todos.v1.usecase';
import { DeleteSoftTodosV1Usecase } from '@todos/application/usecases/v1/delete-soft-todos.v1.usecase';
import { GetAllTodosV1Usecase } from '@todos/application/usecases/v1/get-all-todos.v1.usecase';
import { UpdateTodosV1Usecase } from '@todos/application/usecases/v1/update-todos.v1.usecase';
import { GetByIdTodosV1Usecase } from '@todos/application/usecases/v1/get-by-id-todos.v1.usecase';
import { TODOS_REPOSITORY_TOKEN } from '../ioc-tokens/repositories/todos-repositories.ioc.tokens';
import { TodosRepository } from '@todos/infrastructure/repositories/todos-repository';
import { TODOS_SERVICE_TOKEN } from '../ioc-tokens/services/todos-service.ioc.tokens';
import { TodosService } from '@todos/application/services/todos.service';

export const todosDIProviders: ProvidersDI = [
  { provide: GET_ALL_TODOS_V1_USECASE_TOKEN, useClass: GetAllTodosV1Usecase },
  { provide: CREATE_TODOS_V1_USECASE_TOKEN, useClass: CreateTodosV1Usecase },
  { provide: GET_BY_ID_TODOS_V1_USECASE_TOKEN, useClass: GetByIdTodosV1Usecase },
  { provide: UPDATE_TODOS_V1_USECASE_TOKEN, useClass: UpdateTodosV1Usecase },
  { provide: DELETE_SOFT_TODOS_V1_USECASE_TOKEN, useClass: DeleteSoftTodosV1Usecase },

  { provide: TODOS_REPOSITORY_TOKEN, useClass: TodosRepository },

  { provide: TODOS_SERVICE_TOKEN, useClass: TodosService },
];
