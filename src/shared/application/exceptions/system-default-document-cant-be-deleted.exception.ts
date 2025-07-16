import { IExceptionParams } from "../types/exception.params.types";

export class SystemDefaultDocumentCantBeDeletedException extends Error {
  public constructor(data: IExceptionParams) {
    super(JSON.stringify(data));
  }
}
