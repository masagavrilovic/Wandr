import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('join/:inviteCode')
  join(@Req() req: any, @Param('inviteCode') inviteCode: string) {
    return this.tripService.joinTrip(req.user.id, inviteCode);
  }

  @Post()
  create(@Req() req: any, @Body() createTripDto: CreateTripDto) {
    return this.tripService.create(req.user.id, createTripDto);
  }

  @Get()
  findAllForUser(@Req() req: any) {
    return this.tripService.findAllForUser(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.tripService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateTripDto: UpdateTripDto) {
    return this.tripService.update(id, updateTripDto, req.user.id);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.tripService.remove(id, req.user.id);
  }
}
