import { createFeatureSelector, createSelector } from "@ngrx/store";
import { selectSelectedTripId } from "../../trips/store/trips.selectors";
import { adapter, initialState, NotesState } from "./notes.reducer";

export const notesFeature = createFeatureSelector<NotesState>('notes');

export const selectNotesSliceTripId = createSelector(notesFeature, (state) => state.tripId);
export const selectNotesLoadStatus = createSelector(notesFeature, (state) => state.load.status);
export const selectNotesFetchContext = createSelector(notesFeature, (s) => ({
    tripId: s.tripId,
    nextCursor: s.nextCursor,
    updatedAt: s.updatedAt,
}));

export const selectNotesStateForSelectedTrip = createSelector(
  notesFeature,
  selectSelectedTripId,
  (state, tripId): NotesState => tripId !== null && state.tripId === tripId ? state : initialState
);

const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors(selectNotesStateForSelectedTrip);
export const selectAllNotes = selectAll;
export const selectNoteEntities = selectEntities;
export const selectNoteIds = selectIds;
export const selectNotesTotal = selectTotal;

export const selectNotesLoading = createSelector(selectNotesStateForSelectedTrip, (state) => state.load.status === 'loading');
export const selectNotesLoadingError = createSelector(selectNotesStateForSelectedTrip, (state) => state.load.error);

export const selectNotesInitialLoading = createSelector(
  selectNotesStateForSelectedTrip,
  selectNotesTotal,
  (state, total) =>
    total === 0 &&
    (state.tripId === null || state.load.status === 'loading' || state.load.status === 'idle')
);

export const selectNotesHasNextPage = createSelector(selectNotesStateForSelectedTrip, (s) => s.hasNextPage);
export const selectNotesMoreLoading = createSelector(selectNotesStateForSelectedTrip, (s) => s.more.status === 'loading');
export const selectNotesMoreError = createSelector(selectNotesStateForSelectedTrip, (s) => s.more.error);
export const selectCanLoadMoreNotes = createSelector(
    selectNotesStateForSelectedTrip,
    (s) => s.hasNextPage && s.load.status !== 'loading' && s.more.status !== 'loading',
);

export const selectCreatingNote = createSelector(selectNotesStateForSelectedTrip, (state) => state.create.status === 'loading');
export const selectCreateNoteError = createSelector(selectNotesStateForSelectedTrip, (state) => state.create.error);

export const selectUpdatingNote = createSelector(selectNotesStateForSelectedTrip, (state) => state.update.status === 'loading');
export const selectUpdateNoteError = createSelector(selectNotesStateForSelectedTrip, (state) => state.update.error);

export const selectNoteDeletingIds = createSelector(selectNotesStateForSelectedTrip, (state) => state.deletingIds);
export const selectNoteDeleteErrors = createSelector(selectNotesStateForSelectedTrip, (state) => state.deleteErrors);