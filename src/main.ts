import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configure ValidationPipe to activate dto (data transfer object) validations.
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, // Strip unknown properties 
    forbidNonWhitelisted: true, // Throw an error for unknown properties
    forbidUnknownValues: true, // Throw an error for empty objects
  }));

  // Configure Swagger
  const config = new DocumentBuilder()
  .setTitle('API Specification')
  .setDescription('API documentation for Recreational sports league management')
  .setVersion(version)
  .addBearerAuth() // Add security scheme for token-based authentication
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-spec', app, document); // Route for Swagger docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
