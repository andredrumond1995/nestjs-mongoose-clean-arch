import { IExceptionParams } from '../types/exception.params.types';

export class InputIsNotUniqueException extends Error {
  public constructor(data: IExceptionParams) {
    super(JSON.stringify(data));
  }
}
