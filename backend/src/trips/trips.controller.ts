import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateTripStatusDto } from './dto/update-trip-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, tripImageStorage } from './multer.config';

@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post('join/:inviteCode')
  join(@Req() req: any, @Param('inviteCode') inviteCode: string) {
    return this.tripsService.joinTrip(req.user.id, inviteCode);
  }

  @Post()
  create(@Req() req: any, @Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(req.user.id, createTripDto);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image', {
    storage: tripImageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  uploadImage(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = `/uploads/trips/${file.filename}`;
    return this.tripsService.updateImage(id, req.user.id, imagePath);
  }

  @Get()
  findAllForUser(@Req() req: any) {
    return this.tripsService.findAllForUser(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.tripsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateTripDto: UpdateTripDto) {
    return this.tripsService.update(id, updateTripDto, req.user.id);
  }

  @Patch(':id/status')
  updateStatus(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateTripStatusDto: UpdateTripStatusDto) {
      return this.tripsService.updateStatus(id, updateTripStatusDto.status, req.user.id);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.tripsService.remove(id, req.user.id);
  }
}
