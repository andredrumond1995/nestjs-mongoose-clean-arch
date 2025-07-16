import { ModuleRef } from '@nestjs/core';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work';
import {
  isEmpty,
  map,
  join,
  get,
  some,
  size,
  omit,
  values,
  pick,
  keys,
  compact,
  isNil,
  every,
  has,
} from 'lodash';
import { IRepositoryPort } from '../ports/repositories';
import { IUsecaseParams, IUsecaseDependencies } from '../types/usecases.types';
import { InputIsNotUniqueException } from '../exceptions/input-is-not-unique.exception';
import { FullPartial } from '@shared/typings/partial.types';
import { generateODataFilterForIds } from '@shared/utils/query-string.utils';
import { DocumentsNotFoundByIdException } from '../exceptions/documents-not-found-by-id.exception';
import { DocumentNotFoundByIdException } from '../exceptions/document-not-found-by-id.exception';

export class WriteUsecase<Entity, EntityService> {
  public fieldsToNotSave: string[] = [];
  public executeInputUniquenessChecker = true;
  public uniqueInputFields: string[] = [];
  public sensitiveFields: string[] = [];
  protected repository: IRepositoryPort;
  protected service: EntityService;
  protected unitOfWork: UnitOfWork;
  protected moduleRef: ModuleRef;
  public constructor(params: IUsecaseDependencies<EntityService> = {}) {
    const { repository, service, unitOfWork, moduleRef } = params;
    this.repository = repository!;
    this.service = service!;
    this.unitOfWork = unitOfWork!;
    this.moduleRef = moduleRef!;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async afterAllWriteOperations(params: IUsecaseParams<Entity>): Promise<void> {
    return;
  }

  protected removeSensitiveFieldsFromResult(params: IUsecaseParams<Entity>): FullPartial<Entity>[] {
    const items = compact([params.createdDocument]);
    return map(items, (item) => omit(item as object, this.sensitiveFields));
  }

  protected async getCreatedDocument(
    params: IUsecaseParams<Entity>,
    rawQueryString: string = '$include_deleted=true',
  ): Promise<FullPartial<Entity>> {
    if (!this.service?.['getById']) return params.createdDocument as FullPartial<Entity>;
    return this.getDocumentById(params, rawQueryString);
  }

  protected async checkInputUniqueness(params: IUsecaseParams<Entity>): Promise<void> {
    if (!this.executeInputUniquenessChecker) return;
    const { inputValidated, input, dbSession } = params;
    const dataToCheck = inputValidated || input;
    const rawQueryString = `$filter=${map(this.uniqueInputFields, (field) => {
      const value = dataToCheck?.[field];
      return `${field} eq '${value}'`;
    }).join(' or ')}`;
    const existingDocument = await this.service['getAll']({
      dbSession,
      rawQueryString,
    });

    console.log({existingDocument})
    if (isEmpty(existingDocument['items'])) return;
    const duplicatedFieldsFound = pick(dataToCheck, this.uniqueInputFields);
    const duplicatedKeysFound = join(keys(duplicatedFieldsFound), ', ');
    const duplicatedValuesFound = join(values(duplicatedFieldsFound), ', ');
    throw new InputIsNotUniqueException({
      message: `Input is not unique and cannot be created using [${duplicatedKeysFound}]: [${duplicatedValuesFound}]`,
      data: {
        keys: duplicatedKeysFound,
        values: duplicatedValuesFound,
      },
    });
  }

  protected async checkIfAllDocumentsExistById(params: IUsecaseParams<Entity>): Promise<FullPartial<Entity>[]> {
    const { ids } = params;
    if (!ids) {
      throw new DocumentsNotFoundByIdException({
        message: `No ids provided to check existence.`,
        data: { ids },
      });
    }
    const $filter = `$filter=${generateODataFilterForIds(ids, '_id')}`;
    const rawQueryString = $filter;
    const documentsByIdInDB = get(await this.service['getAll']({ ...params, rawQueryString }), 'items', []);

    if (
      isEmpty(documentsByIdInDB) ||
      some(documentsByIdInDB, { is_deleted: true }) ||
      size(documentsByIdInDB) !== size(ids)
    ) {
      throw new DocumentsNotFoundByIdException({
        message: `Some of the ids were not found by ids [${join(ids, ', ')}]`,
        data: { ids },
      });
    }

    return documentsByIdInDB;
  }

  protected async checkIfDocumentExistsById(params: IUsecaseParams<Entity>): Promise<FullPartial<Entity>> {
    const { id } = params;
    const documentByIdInDB = await this.getDocumentById(params);

    if (
      isEmpty(documentByIdInDB) ||
      (isNil(get(params, 'inputValidated.is_deleted')) && get(documentByIdInDB, 'is_deleted'))
    ) {
      throw new DocumentNotFoundByIdException({
        message: `Document with id '${id}' not found`,
        data: { id },
      });
    }

    return documentByIdInDB;
  }

  protected removeFieldsToNotSave(params: IUsecaseParams<Entity>): FullPartial<Entity> {
    const { inputValidated, input } = params;
    const data = inputValidated ?? input;
    return omit(data as object, this.fieldsToNotSave);
  }

  protected async getDocumentById(
    params: IUsecaseParams<Entity>,
    rawQueryString: string = '$include_deleted=true',
  ): Promise<FullPartial<Entity>> {
    const id = get(params, 'id', get(params, 'createdDocument._id'));
    const { dbSession } = params;

    return this.service['getById']({
      id,
      dbSession,
      rawQueryString,
    });
  }
}
