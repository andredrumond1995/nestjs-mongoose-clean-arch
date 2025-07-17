import { ProvidersDI } from '@shared/application/types/di.types';
import { UNIT_OF_WORK_TOKEN } from '../ioc-tokens/unit-of-work.ioc.tokens';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { LOGGER_SERVICE_TOKEN } from '../../shared-services/ioc-tokens/shared-services.ioc.tokens';
import { ILoggerService } from '@shared/typings/logger.types';
import { MONGODB_DATABASE_NAME } from '@shared/application/constants/mongodb/mongodb-database-names.constants';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work/unit-of-work';

export const unitOfWorkMQDIProviders: ProvidersDI = [
  {
    provide: UNIT_OF_WORK_TOKEN,
    useFactory: (connection: Connection, logger: ILoggerService): UnitOfWork => {
      return new UnitOfWork(connection, logger);
    },
    inject: [getConnectionToken(MONGODB_DATABASE_NAME), LOGGER_SERVICE_TOKEN],
  },
];
