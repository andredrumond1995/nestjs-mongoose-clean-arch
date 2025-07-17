import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '@shared/infrastructure/modules/app-config/app.config.module';
import { ImportsDI } from '@shared/application/types/di.types';
import mongoose from 'mongoose';
import { MONGODB_DATABASE_NAME } from '@shared/application/constants/mongodb/mongodb-database-names.constants';
export const mongodbDIImports: ImportsDI = [
  MongooseModule.forRootAsync({
    connectionName: MONGODB_DATABASE_NAME,
    imports: [AppConfigModule],
    useFactory: (configService: ConfigService) => {
      if (configService.get('MONGODB_USE_DEBUG') === 'true') mongoose.set('debug', true);
      return {
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        writeConcern: { w: 1 },
      };
    },
    inject: [ConfigService],
  }),
];
