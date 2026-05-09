import { Module } from '@nestjs/common';

import { DatabaseModule } from '../db/database.module';
import { ItemsController } from './items.controller';
import { DrizzleItemsRepository, ITEMS_REPOSITORY } from './items.repository';
import { ItemsService } from './items.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ItemsController],
  providers: [
    ItemsService,
    {
      provide: ITEMS_REPOSITORY,
      useClass: DrizzleItemsRepository,
    },
  ],
})
export class ItemsModule {}
