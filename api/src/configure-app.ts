import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Env } from './config/env';
import { parseCorsOrigin } from './config/env';

export function configureApp(app: INestApplication) {
  const configService = app.get<ConfigService<Env, true>>(ConfigService);
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
}
