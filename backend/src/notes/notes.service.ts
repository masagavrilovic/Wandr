import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { TripService } from '../trip/trip.service';
import { NoteResponseDto } from './dto/note-response.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    private readonly tripService: TripService,
  ) {}
  
  async create(userId: number, tripId: number, createNoteDto: CreateNoteDto): Promise<NoteResponseDto> {
    await this.tripService.ensureTripAccess(tripId, userId);

    const newNote = this.noteRepository.create({
      ...createNoteDto,
      tripId
    });
    const savedNote = await this.noteRepository.save(newNote);
    return new NoteResponseDto(savedNote);
  }

  async findAll(userId: number, tripId: number): Promise<NoteResponseDto[]> {
    await this.tripService.ensureTripAccess(tripId, userId);
    const notes = await this.noteRepository.find({ where: { tripId }});
    return notes.map((n) => new NoteResponseDto(n));
  }

  async findOne(userId: number, tripId: number, id: number): Promise<NoteResponseDto> {
    await this.tripService.ensureTripAccess(tripId, userId);
    const note = await this.noteRepository.findOne({ where: { id, tripId }});
    if (!note) throw new NotFoundException('Note not found');
    return new NoteResponseDto(note);
  }

  async update(userId: number, tripId: number, id: number, updateNoteDto: UpdateNoteDto): Promise<NoteResponseDto> {
    await this.tripService.ensureTripAccess(tripId, userId);
    const note = await this.noteRepository.findOne({ where: { id, tripId }});
    if (!note) throw new NotFoundException('Note not found');

    Object.assign(note, updateNoteDto);
    const savedNote = await this.noteRepository.save(note);
    return new NoteResponseDto(savedNote);
  }

  async remove(userId: number, tripId: number, id: number) {
    await this.tripService.ensureTripAccess(tripId, userId);
    const result = await this.noteRepository.delete({ id, tripId });
    if (result.affected === 0) throw new NotFoundException('Note not found');
  }
}
