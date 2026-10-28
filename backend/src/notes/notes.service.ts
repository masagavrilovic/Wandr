import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { LessThan, Repository } from 'typeorm';
import { TripService } from '../trip/trip.service';
import { NoteResponseDto } from './dto/note-response.dto';
import { FindNotesQueryDto } from './dto/find-notes.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

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

  async findAll(userId: number, tripId: number, query: FindNotesQueryDto): Promise<PaginatedResponseDto<NoteResponseDto>> {
    await this.tripService.ensureTripAccess(tripId, userId);

    const { limit = 10, cursor, updatedAt } = query;
    const cursorDate = cursor && updatedAt ? new Date(updatedAt) : null;

    const notes = await this.noteRepository.find({
      where: cursorDate
        ? [
            { tripId, updatedAt: LessThan(cursorDate) },
            { tripId, updatedAt: cursorDate, id: LessThan(cursor!) },
          ]
        : { tripId },
      order: { updatedAt: 'DESC', id: 'DESC' },
      take: limit + 1,
    });

    const hasNextPage = notes.length > limit;
    if (hasNextPage) notes.pop();

    let nextCursor: number | null = null;
    if (hasNextPage && notes.length > 0) {
        nextCursor = notes[notes.length - 1].id;
    }

    const data = notes.map((n) => new NoteResponseDto(n));
    return new PaginatedResponseDto(data, nextCursor, hasNextPage);
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
