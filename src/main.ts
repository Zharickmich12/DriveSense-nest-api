import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/global-exception.filter';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { join } from 'path';
import { LogsService } from './logss/logs.service';
import { LoggingInterceptor } from './common/interceptors/login.interceptor';
import { SwaggerCustomOptions } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor(app.get(LogsService)));

  // Filtro global para excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Cargar el archivo YAML
  const swaggerDocument = YAML.load(join(__dirname, '..', 'docs', 'api.yaml'));

  // Servir Swagger UI en un endpoint
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Pipe global para validaciones
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

   const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      url: '/api-json'
    },
    customCssUrl: [
      'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css',
    ],
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-standalone-preset.js',
    ]
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`App running on: http://localhost:${port}`);
}

bootstrap();