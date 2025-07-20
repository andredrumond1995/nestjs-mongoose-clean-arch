import { IExceptionParams } from '../types/exception.params.types';

export class DocumentsNotFoundByIdException extends Error {
  public constructor(data: IExceptionParams) {
    super(JSON.stringify(data));
  }
}
