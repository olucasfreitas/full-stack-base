import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import mysql, { type Pool } from 'mysql2/promise';

import type { Env } from '../config/env';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool | null = null;
  private database: MySql2Database<typeof schema> | null = null;

  constructor(private readonly configService: ConfigService<Env, true>) {}

  onModuleInit() {
    const databaseUrl = this.configService.getOrThrow('DATABASE_URL', {
      infer: true,
    });

    this.pool = mysql.createPool(databaseUrl);
    this.database = drizzle(this.pool, {
      schema,
      mode: 'default',
    });
  }

  get db(): MySql2Database<typeof schema> {
    if (!this.database) {
      throw new Error('DatabaseService has not been initialized yet.');
    }

    return this.database;
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
