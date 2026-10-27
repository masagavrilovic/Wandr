import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, of, switchMap, map, exhaustMap, mergeMap, EMPTY, withLatestFrom, Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { selectSelectedTripId } from "../../trips/store/trips.selectors";
import { extractErrorMessage } from "../../shared/store/http-error";
import { NotesService } from "../notes.service";
import { CreateNotesActions, DeleteNoteActions, LoadNotesActions, NotesTabActions, UpdateNoteActions } from "./notes.actions";
import { selectNotesLoadStatus, selectNotesSliceTripId } from "./notes.selectors";


@Injectable()
export class NotesEffect {
    private readonly actions$ = inject(Actions);
    private readonly notesService = inject(NotesService);
    private readonly store = inject(Store);
    private readonly selectedTripId$ = this.store.select(selectSelectedTripId) as Observable<number>;

    loadOnTabOpen$ = createEffect(() =>
        this.actions$.pipe(
            ofType(NotesTabActions.opened),
            withLatestFrom(
                this.store.select(selectSelectedTripId),
                this.store.select(selectNotesSliceTripId),
                this.store.select(selectNotesLoadStatus),
            ),
            mergeMap(([, tripId, sliceTripId, status]) =>
                tripId !== null && (sliceTripId !== tripId || status === 'error')
                    ? of(LoadNotesActions.loadNotes({ tripId }))
                    : EMPTY
            )
        )
    );

    
    loadNotes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadNotesActions.loadNotes),
            switchMap(({ tripId }) =>
                this.notesService.getAll(tripId).pipe(
                    map((notes) => LoadNotesActions.loadNotesSuccess({ notes, tripId })),
                    catchError((error) => of(LoadNotesActions.loadNotesFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    createNote$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateNotesActions.createNote),
            withLatestFrom(this.selectedTripId$),
            exhaustMap(([{ payload }, tripId]) =>
                this.notesService.create(tripId, payload).pipe(
                    map((note) => CreateNotesActions.createNoteSuccess({ note, tripId })),
                    catchError((error) => of(CreateNotesActions.createNoteFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    updateNote$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateNoteActions.updateNote),
            withLatestFrom(this.selectedTripId$),
            exhaustMap(([{ id, payload }, tripId]) =>
                this.notesService.update(tripId, id, payload).pipe(
                    map((note) => UpdateNoteActions.updateNoteSuccess({ note, tripId })),
                    catchError((error) => of(UpdateNoteActions.updateNoteFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    deleteNote$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteNoteActions.deleteNote),
            withLatestFrom(this.selectedTripId$),
            mergeMap(([{ id }, tripId]) =>
                this.notesService.delete(tripId, id).pipe(
                    map(() => DeleteNoteActions.deleteNoteSuccess({ id, tripId })),
                    catchError((error) => of(DeleteNoteActions.deleteNoteFailure({ id, error: extractErrorMessage(error) })))
                )
            )
        )
    );
}