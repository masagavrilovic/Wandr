import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post(':tripId')
  create(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(req.user.id, tripId, createNoteDto);
  }

  @Get(':tripId')
  findAll(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number,) {
    return this.notesService.findAll(req.user.id, tripId);
  }

  @Get(':tripId/:id')
  findOne(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number) {
    return this.notesService.findOne(req.user.id, tripId, id);
  }

  @Patch(':tripId/:id')
  update(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(req.user.id, tripId, id, updateNoteDto);
  }

  @Delete(':tripId/:id')
  remove(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number) {
    return this.notesService.remove(req.user.id, tripId, id);
  }
}
