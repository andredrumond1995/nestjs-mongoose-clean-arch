import { MongooseModule } from '@nestjs/mongoose';
import { ImportsDI } from '@shared/application/types/di.types';
import { MONGODB_DATABASE_NAME } from '@shared/application/constants/mongodb/mongodb-database-names.constants';
import { UnitOfWorkModule } from '@shared/infrastructure/modules/unit-of-work/unit-of-work.module';
import { TodosMongooseSchema } from '../../schemas/todos-mongoose.schema';
import { TODOS_MONGODB_COLLECTION_NAME } from '../../constants/todos-mongodb.constants';

export const todosDIImports: ImportsDI = [
  UnitOfWorkModule,
  MongooseModule.forFeature(
    [
      {
        name: TODOS_MONGODB_COLLECTION_NAME,
        schema: TodosMongooseSchema,
      },
    ],
    MONGODB_DATABASE_NAME,
  ),
];
