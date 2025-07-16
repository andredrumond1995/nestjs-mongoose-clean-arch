const commonFields = {
  created_by: 1,
  updated_by: 1,
  is_deleted: 1,
  created_at: 1,
  updated_at: 1,
  user_id: 1,
};
import { IMongoosePopulateOptions } from '@shared/application/types/mongoose.types';
export const MONGODB_POPULATE_COLLECTION_REFS: IMongoosePopulateOptions = {
  ['todo']: {
    path: 'TODO_MONGODB_VIRTUAL_FIELD',
    model: 'TODOS_MONGODB_COLLECTION_NAME',
    select: {
      ...commonFields,
    },
  },
};
