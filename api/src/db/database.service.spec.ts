import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import { DatabaseService } from './database.service';

const mockPool = {
  end: vi.fn().mockResolvedValue(undefined),
};

const mockDatabase = { query: {} };

vi.mock('mysql2/promise', () => ({
  default: {
    createPool: vi.fn(() => mockPool),
  },
}));

vi.mock('drizzle-orm/mysql2', () => ({
  drizzle: vi.fn(() => mockDatabase),
}));

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [
            () => ({
              DATABASE_URL: 'mysql://app:app@127.0.0.1:3306/full_stack_base',
            }),
          ],
        }),
      ],
      providers: [DatabaseService],
    }).compile();

    service = module.get(DatabaseService);
  });

  it('creates the pool and drizzle instance during module init', () => {
    service.onModuleInit();

    expect(mysql.createPool).toHaveBeenCalledWith(
      'mysql://app:app@127.0.0.1:3306/full_stack_base',
    );
    expect(drizzle).toHaveBeenCalledWith(
      mockPool,
      expect.objectContaining({ mode: 'default' }),
    );
    expect(service.db).toBe(mockDatabase);
  });

  it('throws when db is accessed before init', () => {
    expect(() => service.db).toThrow(
      'DatabaseService has not been initialized yet.',
    );
  });

  it('closes the pool on module destroy', async () => {
    service.onModuleInit();
    await service.onModuleDestroy();

    expect(mockPool.end).toHaveBeenCalledOnce();
  });
});
