import { Module } from '@nestjs/common';
import { PackingListService } from './packing-list.service';
import { PackingListController } from './packing-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripModule } from '../trip/trip.module';
import { PackingListItem } from './entities/packing-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PackingListItem]), TripModule],
  controllers: [PackingListController],
  providers: [PackingListService],
})
export class PackingListModule {}
