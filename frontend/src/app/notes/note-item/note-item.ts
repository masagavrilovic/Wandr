import { Component, Input, signal } from '@angular/core';
import { Note, NOTE_COLOR_STYLES } from '../notes.models';
import { CreateUpdateNote } from '../create-update-note/create-update-note';

@Component({
  imports: [CreateUpdateNote],
  selector: 'app-note-item',
  templateUrl: './note-item.html',
})
export class NoteItem {
  @Input({ required: true }) note!: Note;
  colorStyles = NOTE_COLOR_STYLES;
  
  showEditModal = signal(false);
  openEditModal() {
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }
}
