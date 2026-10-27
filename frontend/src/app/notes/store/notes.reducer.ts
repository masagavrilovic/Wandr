import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { failedOp, initialOperation, loadingOp, OperationState, successOp } from "../../shared/store/operation-state";
import { Note } from "../notes.models";
import { CreateNotesActions, DeleteNoteActions, LoadNotesActions, UpdateNoteActions } from "./notes.actions";

export interface NotesState extends EntityState<Note> {
    tripId: number | null;

    load: OperationState;
    create: OperationState;
    update: OperationState;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];
}

export const initialState: NotesState = {
    ids: [],
    entities: {},
    tripId: null,

    load: initialOperation,
    create: initialOperation,
    update: initialOperation,

    deletingIds: [],
    deleteErrors: [],
};

export const adapter: EntityAdapter<Note> = createEntityAdapter<Note>();

export const notesReducer = createReducer(
    initialState,
     on(LoadNotesActions.loadNotes, (state, { tripId }) => {
        if (state.tripId !== tripId) {
            return adapter.removeAll({
                ...state,
                tripId,
                load: loadingOp(),
                create: initialOperation,
                update: initialOperation,
                deletingIds: [],
                deleteErrors: [],
            });
        }
        return { ...state, load: loadingOp() };
    }),
    on(LoadNotesActions.loadNotesSuccess, (state, { notes, tripId }) => {
        if (state.tripId !== tripId) return state;
        return adapter.setAll(notes, { ...state, load: successOp() });
    }),
    on(LoadNotesActions.loadNotesFailure, (state, { error }) => ({
        ...state,
        load: failedOp(error)
    })),
    on(CreateNotesActions.createNote, (state) => ({
        ...state,
        create: loadingOp()
    })),
    on(CreateNotesActions.createNoteSuccess, (state, { note, tripId }) => {
        if (state.tripId !== tripId) return state;
        return adapter.addOne(note, { ...state, create: successOp() });
    }),
    on(CreateNotesActions.createNoteFailure, (state, { error }) => ({
        ...state,
        create: failedOp(error)
    })),
    on(CreateNotesActions.clearCreateError, (state) => ({
        ...state,
        create: initialOperation
    })),
    on(UpdateNoteActions.updateNote, (state) => ({
        ...state,
        update: loadingOp()
    })),
    on(UpdateNoteActions.updateNoteSuccess, (state, { note, tripId }) => {
        if (state.tripId !== tripId) return state;
        return adapter.updateOne({ id: note.id, changes: note }, { ...state, update: successOp() });
    }),
    on(UpdateNoteActions.updateNoteFailure, (state, { error }) => ({
        ...state,
        update: failedOp(error),
    })),
    on(UpdateNoteActions.clearUpdateError, (state) => ({
        ...state,
        update: initialOperation,
    })),
    on(DeleteNoteActions.deleteNote, (state, { id }) => ({
        ...state,
        deletingIds: [...state.deletingIds, id],
        deleteErrors: state.deleteErrors.filter((e) => e.id !== id),
    })),
    on(DeleteNoteActions.deleteNoteSuccess, (state, { id, tripId }) => {
        if (state.tripId !== tripId) return state;
        return adapter.removeOne(id, {
            ...state,
            deletingIds: state.deletingIds.filter((x) => x !== id),
        });
    }),
    on(DeleteNoteActions.deleteNoteFailure, (state, { id, error }) => ({
        ...state,
        deletingIds: state.deletingIds.filter((x) => x !== id),
        deleteErrors: [...state.deleteErrors, { id, message: error }],
    })),
    on(DeleteNoteActions.clearDeleteError, (state, { id }) => ({
        ...state,
        deleteErrors: state.deleteErrors.filter((e) => e.id !== id),
    })),
);