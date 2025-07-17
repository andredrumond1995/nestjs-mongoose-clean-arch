import { Inject, Injectable } from '@nestjs/common';
import { CreateTodosV1UsecasePort } from '@todos/domain/ports/usecases/v1/create-todos.v1.usecase.port';
import { InjectModel } from '@nestjs/mongoose';
import { MONGODB_DATABASE_NAME } from '@shared/application/constants/mongodb/mongodb-database-names.constants';
import { Model } from 'mongoose';
import { ITodosRepositoryPort } from '@todos/domain/ports/repositories/todos.repository.port';
import { TODOS_REPOSITORY_TOKEN } from '@todos/infrastructure/module/ioc-tokens/repositories/todos-repositories.ioc.tokens';
import { UNIT_OF_WORK_TOKEN } from '@shared/infrastructure/modules/unit-of-work/ioc-tokens/unit-of-work.ioc.tokens';
import { TODOS_SERVICE_TOKEN } from '@todos/infrastructure/module/ioc-tokens/services/todos-service.ioc.tokens';
import { TodosService } from '@todos/application/services/todos.service';
import { ICreateUsecaseParams } from '@shared/application/types/usecases.types';
import { ModuleRef } from '@nestjs/core';
import { TodoEntity } from '@shared/application/entities/todo.entity';
import { CreateUsecase } from '@shared/application/usecases/create.usecase';
import { FullPartial } from '@shared/typings/partial.types';
import { TODOS_MONGODB_COLLECTION_NAME } from '@todos/infrastructure/constants/todos-mongodb.constants';
import { TodosMongooseDocument } from '@todos/infrastructure/schemas/todos-mongoose.schema';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work/unit-of-work';

@Injectable()
export class CreateTodosV1Usecase extends CreateUsecase<TodoEntity, TodosService> implements CreateTodosV1UsecasePort {
  public uniqueInputFields: string[] = ['title'];
  public constructor(
    @InjectModel(TODOS_MONGODB_COLLECTION_NAME, MONGODB_DATABASE_NAME)
    model: Model<TodosMongooseDocument>,
    @Inject(TODOS_REPOSITORY_TOKEN) repository: ITodosRepositoryPort,
    @Inject(TODOS_SERVICE_TOKEN) service: TodosService,
    @Inject(UNIT_OF_WORK_TOKEN) unitOfWork: UnitOfWork,
    moduleRef: ModuleRef,
  ) {
    repository.setModel(model);
    super({ repository, unitOfWork, service, moduleRef });
  }

  public async execute(params: ICreateUsecaseParams<TodoEntity>): Promise<FullPartial<TodoEntity>> {
    const { input } = params;
    const inputValidated = TodoEntity.validateCreate(input);

    const result = await super.execute({
      ...params,
      inputValidated,
    });

    return result;
  }
}
