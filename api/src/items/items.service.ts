import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CreateItemDto } from './dto/create-item.dto';
import { PatchItemDto } from './dto/patch-item.dto';
import { ReplaceItemDto } from './dto/replace-item.dto';
import type { NewItemRecord, UpdateItemRecord } from './item.types';
import { ITEMS_REPOSITORY, type ItemsRepository } from './items.repository';

function normalizeDescription(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

@Injectable()
export class ItemsService {
  constructor(
    @Inject(ITEMS_REPOSITORY)
    private readonly itemsRepository: ItemsRepository,
  ) {}

  findAll() {
    return this.itemsRepository.findAll();
  }

  async findOne(id: number) {
    const item = await this.itemsRepository.findById(id);

    if (!item) {
      throw new NotFoundException(`Item ${id} was not found.`);
    }

    return item;
  }

  create(payload: CreateItemDto) {
    return this.itemsRepository.create(this.toNewItemRecord(payload));
  }

  async replace(id: number, payload: ReplaceItemDto) {
    const item = await this.itemsRepository.replace(
      id,
      this.toNewItemRecord(payload),
    );

    if (!item) {
      throw new NotFoundException(`Item ${id} was not found.`);
    }

    return item;
  }

  async patch(id: number, payload: PatchItemDto) {
    const item = await this.itemsRepository.patch(
      id,
      this.toUpdateItemRecord(payload),
    );

    if (!item) {
      throw new NotFoundException(`Item ${id} was not found.`);
    }

    return item;
  }

  async remove(id: number) {
    const deleted = await this.itemsRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Item ${id} was not found.`);
    }
  }

  private toNewItemRecord(
    payload: CreateItemDto | ReplaceItemDto,
  ): NewItemRecord {
    return {
      title: payload.title,
      description: normalizeDescription(payload.description),
      completed: payload.completed ?? false,
    };
  }

  private toUpdateItemRecord(payload: PatchItemDto): UpdateItemRecord {
    return {
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.description !== undefined
        ? { description: normalizeDescription(payload.description) }
        : {}),
      ...(payload.completed !== undefined
        ? { completed: payload.completed }
        : {}),
    };
  }
}
