import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionFilter } from '@shared/infrastructure/filters/mongo/mongo.exception.filter';
import { ProvidersDI } from '@shared/application/types/di.types';
import { NotFoundRouteExceptionFilter } from '@shared/infrastructure/filters/not.found.route.exception.filter';
import { GenericExceptionFilter } from '@shared/infrastructure/filters/generic.exception.filter';
import { DocumentNotFoundByIdExceptionFilter } from '@shared/infrastructure/filters/document-not-found-by-id.exception.filter';
import { InputIsNotUniqueExceptionFilter } from '@shared/infrastructure/filters/input-is-not-unique.exception.filter';
import { DocumentsNotFoundByIdExceptionFilter } from '@shared/infrastructure/filters/documents-not-found-by-id.exception.filter';

export const filtersDIProviders: ProvidersDI = [
  {
    provide: APP_FILTER,
    useClass: GenericExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: DocumentNotFoundByIdExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: DocumentsNotFoundByIdExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: InputIsNotUniqueExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: NotFoundRouteExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: MongoExceptionFilter,
  },
];
