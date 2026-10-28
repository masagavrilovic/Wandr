import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { failedOp, initialOperation, loadingOp, OperationState, successOp } from "../../shared/store/operation-state";
import { Note } from "../notes.models";
import { CreateNotesActions, DeleteNoteActions, LoadNotesActions, UpdateNoteActions } from "./notes.actions";

export interface NotesState extends EntityState<Note> {
    tripId: number | null;
    updatedAt: string | null;
    nextCursor: number | null;
    hasNextPage: boolean;

    load: OperationState;
    more: OperationState;
    create: OperationState;
    update: OperationState;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];
}

export const initialState: NotesState = {
    ids: [],
    entities: {},
    tripId: null,
    updatedAt: null,
    nextCursor: null,
    hasNextPage: false,

    load: initialOperation,
    more: initialOperation,
    create: initialOperation,
    update: initialOperation,

    deletingIds: [],
    deleteErrors: [],
};

export const adapter: EntityAdapter<Note> = createEntityAdapter<Note>({
    sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt) || b.id - a.id,
});

export const notesReducer = createReducer(
    initialState,
     on(LoadNotesActions.loadNotes, (state, { tripId }) => {
        const next: NotesState = { ...state, tripId, load: loadingOp(), more: initialOperation };
        return state.tripId !== tripId
            ? adapter.removeAll({
                ...next,
                updatedAt: null,
                nextCursor: null,
                hasNextPage: false,
                create: initialOperation,
                update: initialOperation,
                deletingIds: [],
                deleteErrors: [],
            })
            : next;
    }),
    on(LoadNotesActions.loadNotesSuccess, (state, { response, tripId }) => {
        if (state.tripId !== tripId) return state;
        return adapter.setAll(response.data, {
            ...state,
            nextCursor: response.nextCursor,
            updatedAt: response.data.at(-1)?.updatedAt ?? null,
            hasNextPage: response.hasNextPage,
            load: successOp(),
        });
    }),
    on(LoadNotesActions.loadNotesFailure, (state, { error }) => ({
        ...state,
        load: failedOp(error)
    })),
    on(LoadNotesActions.loadMoreNotes, (state) => ({ 
        ...state, 
        more: loadingOp()
    })),
    on(LoadNotesActions.loadMoreNotesSuccess, (state, { response, tripId }) => {
        if (state.tripId !== tripId) return state;
        return adapter.upsertMany(response.data, {
            ...state,
            nextCursor: response.nextCursor,
            updatedAt: response.data.at(-1)?.updatedAt ?? null,
            hasNextPage: response.hasNextPage,
            more: successOp(),
        });
    }),
    on(LoadNotesActions.loadMoreNotesFailure, (state, { error }) => ({
        ...state,
        more: failedOp(error),
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