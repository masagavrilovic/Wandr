import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { TripService } from '../trip/trip.service';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>,
        private readonly tripService: TripService,
    ) {}

    async create(userId: number, tripId: number, createActivityDto: CreateActivityDto): Promise<ActivityResponseDto> {
        await this.tripService.ensureTripAccess(tripId, userId);

        const newActivity = this.activityRepository.create({ 
          ...createActivityDto, 
          tripId 
        });
        const savedActivity = await this.activityRepository.save(newActivity);
        return new ActivityResponseDto(savedActivity);
    }

    async findAll(userId: number, tripId: number): Promise<ActivityResponseDto[]> {
        await this.tripService.ensureTripAccess(tripId, userId);

        const activities = await this.activityRepository.find({
            where: { tripId },
            order: { date: 'ASC', time: 'ASC', id: 'ASC' },
        });

        return activities.map((a) => new ActivityResponseDto(a));
    }

    async findOne(userId: number, tripId: number, id: number): Promise<ActivityResponseDto> {
        const activity = await this.findActivity(userId, tripId, id);
        return new ActivityResponseDto(activity);
    }

    async update(userId: number, tripId: number, id: number, updateActivityDto: UpdateActivityDto): Promise<ActivityResponseDto> {
        const activity = await this.findActivity(userId, tripId, id);

        Object.assign(activity, updateActivityDto);
        const savedActivity = await this.activityRepository.save(activity);

        return new ActivityResponseDto(savedActivity);
    }

    async remove(userId: number, tripId: number, id: number): Promise<void> {
        const activity = await this.findActivity(userId, tripId, id);
        await this.activityRepository.remove(activity);
    }

    private async findActivity(userId: number, tripId: number, id: number): Promise<Activity> {
        await this.tripService.ensureTripAccess(tripId, userId);

        const activity = await this.activityRepository.findOne({
            where: { id, tripId },
        });

        if (!activity) throw new NotFoundException('Activity not found');

        return activity;
    }
}