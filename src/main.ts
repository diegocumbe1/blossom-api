import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigValidator } from './infrastructure/config/config-validator';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validate configuration
  const configValidator = app.get(ConfigValidator);
  configValidator.validateApiConfig();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Blossom API')
    .setDescription(
      'REST API for retrieving character information from Pokemon and Digimon franchises',
    )
    .setVersion('1.0')
    .addTag('Characters', 'Endpoints for character information')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  console.log('🚀 Blossom API is running on port', port);
  console.log(
    '📚 Swagger documentation available at: http://localhost:' +
      port +
      '/api-docs',
  );
}
bootstrap();
