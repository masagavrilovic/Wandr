import { Note, NoteColor } from "../entities/note.entity";

export class NoteResponseDto {
  id: number;
  title: string;
  content: string | null;
  tripId: number;
  color: NoteColor;
  createdAt: Date;
  updatedAt: Date;

  constructor(note: Note) {
    this.id = note.id;
    this.title = note.title;
    this.content = note.content ? note.content : null;
    this.tripId = note.tripId;
    this.color = note.color;
    this.createdAt = note.createdAt;
    this.updatedAt = note.updatedAt;
  }
}