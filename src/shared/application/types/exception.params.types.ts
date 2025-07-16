import { HttpStatus } from '@nestjs/common';
import { RecordAny } from './any.types';

export interface IExceptionParams {
  message?: string;
  statusCode?: HttpStatus;
  data?: RecordAny;
}
