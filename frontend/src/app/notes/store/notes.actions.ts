import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CreateUpdateNotePayload, Note } from "../notes.models";

export const NotesTabActions = createActionGroup({
    source: 'Notes Tab',
    events: {
        'Opened': emptyProps(),
    }
});

export const LoadNotesActions = createActionGroup({
    source: 'Notes',
    events: {
        'Load Notes': props<{ tripId: number }>(),
        'Load Notes Success': props<{ notes: Note[], tripId: number }>(),
        'Load Notes Failure': props<{ error: string }>(),
    }
});

export const CreateNotesActions = createActionGroup({
    source: 'Notes',
    events: {
        'Create Note': props<{ payload: CreateUpdateNotePayload }>(),
        'Create Note Success': props<{ note: Note, tripId: number }>(),
        'Create Note Failure': props<{ error: string }>(),
        'Clear Create Error': emptyProps(),
    }
});

export const UpdateNoteActions = createActionGroup({
  source: 'Notes',
  events: {
    'Update Note': props<{ id: number, payload: CreateUpdateNotePayload }>(),
    'Update Note Success': props<{ note: Note, tripId: number}>(),
    'Update Note Failure': props<{ error: string}>(),
    'Clear Update Error': emptyProps(),
  }
});

export const DeleteNoteActions = createActionGroup({
    source: 'Notes',
    events: {
        'Delete Note': props<{ id: number }>(),
        'Delete Note Success': props<{ id: number, tripId: number }>(),
        'Delete Note Failure': props<{ id: number, error: string }>(),
        'Clear Delete Error': props<{ id: number }>(),
    }
});