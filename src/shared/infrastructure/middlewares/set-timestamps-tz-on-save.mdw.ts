import { DATE_TIME_FORMATS } from '@shared/application/constants/datetime.constants';
import { formatDatetime } from '@shared/utils/datetime.utils';
import { CallbackWithoutResultAndOptionalError } from 'mongoose';

export function setTimestampsTzOnCreateMdw(next: CallbackWithoutResultAndOptionalError): void {
  const now = formatDatetime({ value: new Date(), outputFormat: DATE_TIME_FORMATS.MONGODB });
  this.updated_at = now;
  this.created_at = now;
  next();
}
