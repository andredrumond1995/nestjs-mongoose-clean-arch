import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'bson';
import { isEmpty } from 'lodash';
import { RecordAny } from '../types/any.types';

export const handleNotFoundDocumentIdUtil = (id: ObjectId, entity: string, existingDocument: RecordAny): void => {
  if (isEmpty(existingDocument)) throw new NotFoundException(`${id} is not found as a ${entity} document`);
};
