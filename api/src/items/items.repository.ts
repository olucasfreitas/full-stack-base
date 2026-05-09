import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';

import { DatabaseService } from '../db/database.service';
import { items } from '../db/schema';
import type { ItemRecord, NewItemRecord, UpdateItemRecord } from './item.types';

export const ITEMS_REPOSITORY = Symbol('ITEMS_REPOSITORY');

export interface ItemsRepository {
  findAll(): Promise<ItemRecord[]>;
  findById(id: number): Promise<ItemRecord | null>;
  create(data: NewItemRecord): Promise<ItemRecord>;
  replace(id: number, data: NewItemRecord): Promise<ItemRecord | null>;
  patch(id: number, data: UpdateItemRecord): Promise<ItemRecord | null>;
  delete(id: number): Promise<boolean>;
}

@Injectable()
export class DrizzleItemsRepository implements ItemsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.db
      .select()
      .from(items)
      .orderBy(desc(items.updatedAt), desc(items.id));
  }

  async findById(id: number) {
    const [item] = await this.databaseService.db
      .select()
      .from(items)
      .where(eq(items.id, id));

    return item ?? null;
  }

  async create(data: NewItemRecord) {
    const [inserted] = await this.databaseService.db
      .insert(items)
      .values(data)
      .$returningId();

    const item = await this.findById(inserted.id);

    if (!item) {
      throw new Error('Created item could not be loaded.');
    }

    return item;
  }

  async replace(id: number, data: NewItemRecord) {
    const existing = await this.findById(id);

    if (!existing) {
      return null;
    }

    await this.databaseService.db
      .update(items)
      .set(data)
      .where(eq(items.id, id));
    return this.findById(id);
  }

  async patch(id: number, data: UpdateItemRecord) {
    const existing = await this.findById(id);

    if (!existing) {
      return null;
    }

    await this.databaseService.db
      .update(items)
      .set(data)
      .where(eq(items.id, id));
    return this.findById(id);
  }

  async delete(id: number) {
    const existing = await this.findById(id);

    if (!existing) {
      return false;
    }

    await this.databaseService.db.delete(items).where(eq(items.id, id));
    return true;
  }
}
