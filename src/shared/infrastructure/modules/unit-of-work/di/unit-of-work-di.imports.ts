import { ConfigModule } from '@nestjs/config';
import { ImportsDI } from '@shared/application/types/di.types';
import { SharedServicesModule } from '../../shared-services/shared.services.module';

export const unitOfWorkDIImports: ImportsDI = [ConfigModule, SharedServicesModule];
