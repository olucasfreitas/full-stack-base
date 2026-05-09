import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import type { Env } from './config/env';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.getOrThrow('PORT', { infer: true });

  configureApp(app);

  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exitCode = 1;
});
