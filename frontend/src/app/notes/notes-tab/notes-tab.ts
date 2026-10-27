import { Component, inject, OnInit, signal } from '@angular/core';
import { CreateUpdateNote } from '../create-update-note/create-update-note';
import { Store } from '@ngrx/store';
import { selectAllNotes } from '../store/notes.selectors';
import { AsyncPipe } from '@angular/common';
import { NotesTabActions } from '../store/notes.actions';
import { NoteItem } from '../note-item/note-item';

@Component({
  imports: [CreateUpdateNote, AsyncPipe, NoteItem],
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.html',
})
export class NotesTab implements OnInit {
  private store = inject(Store);
  notes$ = this.store.select(selectAllNotes);

  protected showCreateModal = signal(false);
  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  ngOnInit(): void {
    this.store.dispatch(NotesTabActions.opened());
  }
}
