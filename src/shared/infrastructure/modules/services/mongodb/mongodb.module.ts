import { Module } from '@nestjs/common';
import { mongodbDIImports } from './di/mongodb-di.import';

@Module({
  imports: mongodbDIImports,
})
export class MongoDbModule {}
