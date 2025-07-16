import { ImportsDI } from '@shared/application/types/di.types';
import { MongoDbModule } from '../../services/mongodb/mongodb.module';
export const databasesDIImports: ImportsDI = [MongoDbModule];
