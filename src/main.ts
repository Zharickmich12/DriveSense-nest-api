import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/global-exception.filter';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { LogsService } from './logss/logs.service';
import { LoggingInterceptor } from './common/interceptors/login.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor(app.get(LogsService)));

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('DriveSense API')
    .setDescription('API Backend para el control inteligente de pico y placa')
    .setVersion('1.0')
    .addBearerAuth() // JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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