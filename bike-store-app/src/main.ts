import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configure a global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false, // Automatically transforms input data to the DTO class
      whitelist: true, // Strips any properties that are not defined in the DTO class
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
    }),
  );
  await app.listen(3000);
}
bootstrap();
