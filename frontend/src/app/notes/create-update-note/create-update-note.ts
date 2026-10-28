import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { CreateUpdateNotePayload, Note, NOTE_COLOR_STYLES, NoteColor } from '../notes.models';
import { Observable } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CreateNotesActions, DeleteNoteActions, UpdateNoteActions } from '../store/notes.actions';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectCreateNoteError, selectCreatingNote, selectUpdateNoteError, selectUpdatingNote } from '../store/notes.selectors';
import { AsyncPipe } from '@angular/common';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';

@Component({
  imports: [AsyncPipe, ReactiveFormsModule, NgxEditorModule],
  selector: 'app-create-update-note',
  templateUrl: './create-update-note.html',
})
export class CreateUpdateNote implements OnInit, OnDestroy {
  @Input() note: Note | null = null;
  @Output() closed = new EventEmitter();

  colors = Object.values(NoteColor);
  colorStyles = NOTE_COLOR_STYLES;

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);
  
  isEditMode = false;
  isSaving$!: Observable<boolean>;
  error$!: Observable<string | null>;

  noteForm = this.fb.group({
    title: ['', [Validators.required]],
    content: [''],
    color: [NoteColor.DEFAULT]
  });

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  showDeleteModal = signal(false);

  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  confirmDelete(): void {
    this.store.dispatch(DeleteNoteActions.deleteNote({ id: this.note!.id }));
    this.showDeleteModal.set(false);
    this.close();
  }

  constructor() {
    this.actions$
      .pipe(
        ofType(CreateNotesActions.createNoteSuccess, UpdateNoteActions.updateNoteSuccess),
        takeUntilDestroyed()
      )
      .subscribe(() => this.close());
  }
  ngOnInit(): void {
    this.editor = new Editor();
    this.isEditMode = !!this.note;

    if (this.isEditMode) {
      this.isSaving$ = this.store.select(selectUpdatingNote);
      this.error$ = this.store.select(selectUpdateNoteError);
      this.store.dispatch(UpdateNoteActions.clearUpdateError());
      this.noteForm.patchValue({
        title: this.note!.title,
        content: this.note!.content ?? null,
        color: this.note!.color,
      })
    } else {
      this.isSaving$ = this.store.select(selectCreatingNote);
      this.error$ = this.store.select(selectCreateNoteError);
      this.store.dispatch(CreateNotesActions.clearCreateError());
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onSubmit() {
    if (this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      return;
    }

    const { title, content, color } = this.noteForm.getRawValue();
    const isEmpty = !content || content === '<p></p>';
    const payload: CreateUpdateNotePayload = {
      title: title!,
      content: isEmpty ? undefined : content,
      color: color ?? NoteColor.DEFAULT
    };
     if (this.isEditMode) this.store.dispatch(UpdateNoteActions.updateNote({ id: this.note!.id, payload }));
     else this.store.dispatch(CreateNotesActions.createNote({ payload }));
  }

  close(isSaving?: boolean | null) {
    if (!isSaving) this.closed.emit();
  }
}
