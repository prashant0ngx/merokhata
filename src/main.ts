import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();//allow cross origin resource sharing
  app.setGlobalPrefix('api'); //localhost:3000/api

  await app.listen(
    configuration().port,
  );
}
bootstrap();
