import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { CreateItemDto } from './dto/create-item.dto';
import { PatchItemDto } from './dto/patch-item.dto';
import { ReplaceItemDto } from './dto/replace-item.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateItemDto) {
    return this.itemsService.create(payload);
  }

  @Put(':id')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: ReplaceItemDto,
  ) {
    return this.itemsService.replace(id, payload);
  }

  @Patch(':id')
  patch(@Param('id', ParseIntPipe) id: number, @Body() payload: PatchItemDto) {
    return this.itemsService.patch(id, payload);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.remove(id);
  }
}
