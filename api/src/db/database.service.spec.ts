import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import type { Env } from '../config/env';
import * as schema from './schema';
import { DatabaseService } from './database.service';

vi.mock('mysql2/promise', () => ({
  default: {
    createPool: vi.fn(),
  },
  createPool: vi.fn(),
}));

vi.mock('drizzle-orm/mysql2', () => ({
  drizzle: vi.fn(),
}));

describe('DatabaseService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initializes the database pool during module startup', () => {
    const pool = {
      end: vi.fn().mockResolvedValue(undefined),
    };
    const getOrThrow = vi
      .fn()
      .mockReturnValue('mysql://app:app@127.0.0.1:3306/full_stack_base');
    const database = {
      query: {},
    };
    const configService = {
      getOrThrow,
    } as unknown as ConfigService<Env, true>;

    vi.mocked(mysql.createPool).mockReturnValue(pool as never);
    vi.mocked(drizzle).mockReturnValue(database as never);

    const service = new DatabaseService(configService);

    service.onModuleInit();

    expect(getOrThrow).toHaveBeenCalledWith('DATABASE_URL', {
      infer: true,
    });
    expect(mysql.createPool).toHaveBeenCalledWith(
      'mysql://app:app@127.0.0.1:3306/full_stack_base',
    );
    expect(drizzle).toHaveBeenCalledWith(pool, {
      schema,
      mode: 'default',
    });
    expect(service.db).toBe(database);
  });

  it('closes the pool when the module shuts down', async () => {
    const pool = {
      end: vi.fn().mockResolvedValue(undefined),
    };
    const getOrThrow = vi
      .fn()
      .mockReturnValue('mysql://app:app@127.0.0.1:3306/full_stack_base');
    const configService = {
      getOrThrow,
    } as unknown as ConfigService<Env, true>;

    vi.mocked(mysql.createPool).mockReturnValue(pool as never);
    vi.mocked(drizzle).mockReturnValue({} as never);

    const service = new DatabaseService(configService);

    service.onModuleInit();
    await service.onModuleDestroy();

    expect(pool.end).toHaveBeenCalledTimes(1);
  });
});
