import { Injectable } from '@nestjs/common';
import { TodoEntity } from '@shared/application/entities/todo.entity';
import {
  GET_ALL_TODOS_V1_USECASE_TOKEN,
  GET_BY_ID_TODOS_V1_USECASE_TOKEN,
} from '@todos/infrastructure/module/ioc-tokens/usecases/todos-usecases.ioc.tokens';

import { ModuleRef } from '@nestjs/core';
import { ServiceMethodsEnum } from '@shared/application/enums/service.enums';
import { Service } from '@shared/services/service';
import { IServiceInjection, IServiceParams } from '@shared/application/types/services.types';

@Injectable()
export class TodosService extends Service<TodoEntity> {
  public static SKIP_ALL_TODOS_ODATA_PARAM_VALUE = 100;

  public constructor(moduleRef: ModuleRef) {
    const injections: IServiceInjection[] = [
      {
        token: GET_ALL_TODOS_V1_USECASE_TOKEN,
        method: ServiceMethodsEnum.GET_ALL,
      },
      {
        token: GET_BY_ID_TODOS_V1_USECASE_TOKEN,
        method: ServiceMethodsEnum.GET_BY_ID,
      },
    ];
    const params: IServiceParams = {
      injections,
      serviceName: TodosService.name,
      moduleRef,
    };
    super(params);
  }
}
