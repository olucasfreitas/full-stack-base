import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { configureApp } from '../configure-app';
import type { ItemRecord, NewItemRecord, UpdateItemRecord } from './item.types';
import { ItemsController } from './items.controller';
import { ITEMS_REPOSITORY, type ItemsRepository } from './items.repository';
import { ItemsService } from './items.service';

class InMemoryItemsRepository implements ItemsRepository {
  private readonly items = new Map<number, ItemRecord>();
  private nextId = 1;

  async findAll(): Promise<ItemRecord[]> {
    return Array.from(this.items.values());
  }

  async findById(id: number): Promise<ItemRecord | null> {
    return this.items.get(id) ?? null;
  }

  async create(data: NewItemRecord): Promise<ItemRecord> {
    const now = new Date();
    const item: ItemRecord = {
      id: this.nextId++,
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: now,
      updatedAt: now,
    };

    this.items.set(item.id, item);
    return item;
  }

  async replace(id: number, data: NewItemRecord): Promise<ItemRecord | null> {
    const existing = this.items.get(id);

    if (!existing) {
      return null;
    }

    const updated: ItemRecord = {
      ...existing,
      title: data.title,
      description: data.description,
      completed: data.completed,
      updatedAt: new Date(),
    };

    this.items.set(id, updated);
    return updated;
  }

  async patch(id: number, data: UpdateItemRecord): Promise<ItemRecord | null> {
    const existing = this.items.get(id);

    if (!existing) {
      return null;
    }

    const updated: ItemRecord = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    this.items.set(id, updated);
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    return this.items.delete(id);
  }
}

describe('Items HTTP', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        ItemsService,
        {
          provide: ITEMS_REPOSITORY,
          useClass: InMemoryItemsRepository,
        },
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

  it('supports full CRUD over HTTP', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/items')
      .send({
        title: 'Ship starter',
        description: 'Wire web and api together.',
        completed: false,
      })
      .expect(201);

    expect(createResponse.body).toMatchObject({
      id: 1,
      title: 'Ship starter',
      description: 'Wire web and api together.',
      completed: false,
    });

    await request(app.getHttpServer())
      .get('/api/items')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0].id).toBe(1);
      });

    await request(app.getHttpServer())
      .get('/api/items/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBe(1);
        expect(body.title).toBe('Ship starter');
      });

    await request(app.getHttpServer())
      .put('/api/items/1')
      .send({
        title: 'Ship polished starter',
        description: 'Replace the whole record.',
        completed: true,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.title).toBe('Ship polished starter');
        expect(body.completed).toBe(true);
      });

    await request(app.getHttpServer())
      .patch('/api/items/1')
      .send({ completed: false })
      .expect(200)
      .expect(({ body }) => {
        expect(body.completed).toBe(false);
      });

    await request(app.getHttpServer()).delete('/api/items/1').expect(204);

    await request(app.getHttpServer()).get('/api/items/1').expect(404);
  });

  it('returns the standard validation message array for an empty title', async () => {
    await request(app.getHttpServer())
      .post('/api/items')
      .send({
        title: '   ',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toEqual(['Title is required.']);
      });
  });
});
