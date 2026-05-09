import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './config/env';
import { AppController } from './app.controller';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: (config) => validateEnv(config),
    }),
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
