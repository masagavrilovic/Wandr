import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { PackingListService } from './packing-list.service';
import { CreatePackingListItemDto } from './dto/create-packing-list.dto';
import { UpdatePackingListItemDto } from './dto/update-packing-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('packing-list')
export class PackingListController {
  constructor(private readonly packingListService: PackingListService) {}

  @Post(':tripId')
  create(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Body() createPackingListItemDto: CreatePackingListItemDto) {
    return this.packingListService.create(req.user.id, tripId, createPackingListItemDto);
  }

  @Get(':tripId')
  findAll(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number) {
    return this.packingListService.findAll(req.user.id, tripId);
  }

  @Get(':tripId/:id')
  findOne(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number) {
    return this.packingListService.findOne(req.user.id, tripId, id);
  }

  @Patch(':tripId/:id')
  update(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number, @Body() updatePackingListItemDto: UpdatePackingListItemDto) {
    return this.packingListService.update(req.user.id, tripId, id, updatePackingListItemDto);
  }

  @Delete(':tripId/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number) {
    return this.packingListService.remove(req.user.id, tripId, id);
  }
}
