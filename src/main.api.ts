import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApiModule);
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
