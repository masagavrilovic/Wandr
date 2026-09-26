import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @Post(':tripId')
    create(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Body() createActivityDto: CreateActivityDto): Promise<ActivityResponseDto> {
        return this.activityService.create(req.user.id, tripId, createActivityDto);
    }

    @Get(':tripId')
    findAll(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number): Promise<ActivityResponseDto[]> {
        return this.activityService.findAll(req.user.id, tripId);
    }

    @Get(':tripId/:id')
    findOne(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number): Promise<ActivityResponseDto> {
        return this.activityService.findOne(req.user.id, tripId, id);
    }

    @Patch(':tripId/:id')
    update(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number, @Body() updateActivityDto: UpdateActivityDto): Promise<ActivityResponseDto> {
        return this.activityService.update(req.user.id, tripId, id, updateActivityDto);
    }

    @Delete(':tripId/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.activityService.remove(req.user.id, tripId, id);
    }
}