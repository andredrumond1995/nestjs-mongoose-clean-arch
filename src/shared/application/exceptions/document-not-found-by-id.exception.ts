import { IExceptionParams } from "../types/exception.params.types";

export class DocumentNotFoundByIdException extends Error {
  public constructor(data: IExceptionParams) {
    super(JSON.stringify(data));
  }
}
