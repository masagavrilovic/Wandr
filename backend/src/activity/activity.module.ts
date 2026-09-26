import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { TripModule } from '../trip/trip.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), TripModule],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
