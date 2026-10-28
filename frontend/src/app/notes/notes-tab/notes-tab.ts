import { Component, inject, OnInit, signal } from '@angular/core';
import { CreateUpdateNote } from '../create-update-note/create-update-note';
import { Store } from '@ngrx/store';
import { selectAllNotes, selectNoteDeleteErrors, selectNotesInitialLoading, selectNotesLoadingError } from '../store/notes.selectors';
import { AsyncPipe } from '@angular/common';
import { DeleteNoteActions, NotesTabActions } from '../store/notes.actions';
import { NoteItem } from '../note-item/note-item';

@Component({
  imports: [CreateUpdateNote, AsyncPipe, NoteItem],
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.html',
})
export class NotesTab implements OnInit {
  private store = inject(Store);
  initialLoading$ = this.store.select(selectNotesInitialLoading);
  loadError$ = this.store.select(selectNotesLoadingError);
  notes$ = this.store.select(selectAllNotes);

  deleteErrors$ = this.store.select(selectNoteDeleteErrors);
  dismissDeleteError(id: number): void {
    this.store.dispatch(DeleteNoteActions.clearDeleteError({ id }));
  }

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
