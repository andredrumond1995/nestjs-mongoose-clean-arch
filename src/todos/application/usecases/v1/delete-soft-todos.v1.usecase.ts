import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DeleteSoftTodosV1UsecasePort } from '@todos/domain/ports/usecases/v1/delete-soft-todos.v1.usecase.port';
import { InjectModel } from '@nestjs/mongoose';
import { MONGODB_DATABASE_NAME } from '@shared/application/constants/mongodb/mongodb-database-names.constants';
import { ITodosRepositoryPort } from '@todos/domain/ports/repositories/todos.repository.port';
import { TODOS_REPOSITORY_TOKEN } from '@todos/infrastructure/module/ioc-tokens/repositories/todos-repositories.ioc.tokens';
import { UNIT_OF_WORK_TOKEN } from '@shared/infrastructure/modules/unit-of-work/ioc-tokens/unit-of-work.ioc.tokens';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work';
import { IDeleteSoftUsecaseOutput, IDeleteSoftUsecaseParams } from '@shared/application/types/usecases.types';
import { TodosService } from '@todos/application/services/todos.service';
import { TODOS_SERVICE_TOKEN } from '@todos/infrastructure/module/ioc-tokens/services/todos-service.ioc.tokens';
import { ModuleRef } from '@nestjs/core';
import { TodoEntity } from '@shared/application/entities/todo.entity';
import { DeleteSoftUsecase } from '@shared/application/usecases/delete-soft.usecase';
import { TODOS_MONGODB_COLLECTION_NAME } from '@todos/infrastructure/constants/todos-mongodb.constants';
import { TodosMongooseDocument } from '@todos/infrastructure/schemas/todos-mongoose.schema';

@Injectable()
export class DeleteSoftTodosV1Usecase
  extends DeleteSoftUsecase<TodoEntity, TodosService>
  implements DeleteSoftTodosV1UsecasePort
{
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
  public async execute(params: IDeleteSoftUsecaseParams<TodoEntity>): Promise<IDeleteSoftUsecaseOutput> {
    const result = await super.execute(params);

    return result;
  }
}
