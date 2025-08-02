import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { EXCLUDED_ROUTES_DETAILED } from './config/routes.config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.set('trust proxy', true);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1', {
    exclude: EXCLUDED_ROUTES_DETAILED,
  });

  const config = new DocumentBuilder()
    .setTitle('Links Shortener API')
    .setDescription('API para acortar enlaces')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
