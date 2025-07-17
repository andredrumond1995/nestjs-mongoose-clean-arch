import { Inject, Injectable } from '@nestjs/common';
import { IPaginatedItems } from '@shared/application/types/pagination.types';
import { GetAllTodosV1UsecasePort } from '@todos/domain/ports/usecases/v1/get-all-todos.v1.usecase.port';
import { InjectModel } from '@nestjs/mongoose';
import { MONGODB_DATABASE_NAME } from '@shared/application/constants/mongodb/mongodb-database-names.constants';
import { Model } from 'mongoose';
import { ITodosRepositoryPort } from '@todos/domain/ports/repositories/todos.repository.port';
import { TODOS_REPOSITORY_TOKEN } from '@todos/infrastructure/module/ioc-tokens/repositories/todos-repositories.ioc.tokens';
import { TodosService } from '@todos/application/services/todos.service';
import { ModuleRef } from '@nestjs/core';
import { IGetAllUsecaseParams } from '@shared/application/types/usecases.types';
import { UNIT_OF_WORK_TOKEN } from '@shared/infrastructure/modules/unit-of-work/ioc-tokens/unit-of-work.ioc.tokens';
import { TodoEntity } from '@shared/application/entities/todo.entity';
import { GetAllUsecase } from '@shared/application/usecases/get-all.usecase';
import { FullPartial } from '@shared/typings/partial.types';
import { TODOS_MONGODB_COLLECTION_NAME } from '@todos/infrastructure/constants/todos-mongodb.constants';
import { TodosMongooseDocument } from '@todos/infrastructure/schemas/todos-mongoose.schema';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work/unit-of-work';

@Injectable()
export class GetAllTodosV1Usecase extends GetAllUsecase<TodoEntity, TodosService> implements GetAllTodosV1UsecasePort {
  public constructor(
    @InjectModel(TODOS_MONGODB_COLLECTION_NAME, MONGODB_DATABASE_NAME)
    model: Model<TodosMongooseDocument>,
    @Inject(TODOS_REPOSITORY_TOKEN) repository: ITodosRepositoryPort,
    @Inject(UNIT_OF_WORK_TOKEN) unitOfWork: UnitOfWork,
    moduleRef: ModuleRef,
  ) {
    repository.setModel(model);
    super({ repository, unitOfWork, moduleRef });
  }

  public async execute(params: IGetAllUsecaseParams<TodoEntity>): Promise<IPaginatedItems<FullPartial<TodoEntity>[]>> {
    const result = await super.execute(params);
    return result;
  }
}
