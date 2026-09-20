import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Trip } from '../trip/entities/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Trip])],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
