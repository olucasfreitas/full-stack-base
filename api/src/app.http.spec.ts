import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { configureApp } from './configure-app';
import { AppController } from './app.controller';

describe('App HTTP', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: vi.fn((key: string) => {
              if (key === 'CORS_ORIGIN') {
                return 'http://localhost:5173';
              }

              throw new Error(`Unexpected key: ${key}`);
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(false);
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('serves the health route without the api prefix', async () => {
    await request(app.getHttpServer()).get('/health').expect(200).expect({
      service: 'api',
      status: 'ok',
    });
  });
});
