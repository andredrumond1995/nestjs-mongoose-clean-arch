import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  exports: [ConfigModule],
})
export class AppConfigModule {}
