import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import mysql, { type Pool } from 'mysql2/promise';

import type { Env } from '../config/env';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool: Pool | null = null;
  private database: MySql2Database<typeof schema> | null = null;

  constructor(private readonly configService: ConfigService<Env, true>) {}

  get db(): MySql2Database<typeof schema> {
    if (!this.database) {
      const databaseUrl = this.configService.getOrThrow('DATABASE_URL', {
        infer: true,
      });

      this.pool = mysql.createPool(databaseUrl);
      this.database = drizzle(this.pool, {
        schema,
        mode: 'default',
      });
    }

    return this.database;
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
