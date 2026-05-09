import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import type { Env } from './config/env';
import { parseCorsOrigin } from './config/env';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.getOrThrow('PORT', { infer: true });
  const corsOrigin = configService.getOrThrow('CORS_ORIGIN', { infer: true });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors({
    origin: parseCorsOrigin(corsOrigin),
  });

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
