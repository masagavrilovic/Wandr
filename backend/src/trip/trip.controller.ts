import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { imageFileFilter, tripImageStorage } from './multer.config';
import { CleanupUploadOnErrorInterceptor } from './multer.interceptor';

const TRIP_IMAGE_URL_PREFIX = '/uploads/trips';

const tripImageInterceptor = () =>
  FileInterceptor('image', {
    storage: tripImageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  });

const toImagePath = (file?: Express.Multer.File) =>
  file ? `${TRIP_IMAGE_URL_PREFIX}/${file.filename}` : undefined;

@UseGuards(JwtAuthGuard)
@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('join/:inviteCode')
  join(@Req() req: any, @Param('inviteCode') inviteCode: string) {
    return this.tripService.joinTrip(req.user.id, inviteCode);
  }

  @Post()
  @UseInterceptors(tripImageInterceptor(), CleanupUploadOnErrorInterceptor)
  create(
    @Req() req: any,
    @Body() createTripDto: CreateTripDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.tripService.create(req.user.id, createTripDto, toImagePath(file));
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
  @UseInterceptors(tripImageInterceptor(), CleanupUploadOnErrorInterceptor)
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTripDto: UpdateTripDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file && updateTripDto.removeImage) {
      throw new BadRequestException(
        'Cannot upload a new image and remove the image in the same request',
      );
    }

    return this.tripService.update(id, updateTripDto, req.user.id, toImagePath(file));
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.tripService.remove(id, req.user.id);
  }
}