import { ImportsDI } from '@shared/application/types/di.types';
import { UnitOfWorkModule } from '../../unit-of-work/unit-of-work.module';

export const interceptorsDIImports: ImportsDI = [UnitOfWorkModule];
