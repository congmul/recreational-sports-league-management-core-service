import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configure ValidationPipe to activate dto (data transfer object) validations.
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, // Strip unknown properties 
    forbidNonWhitelisted: true, // Throw an error for unknown properties
    forbidUnknownValues: true, // Throw an error for empty objects
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
