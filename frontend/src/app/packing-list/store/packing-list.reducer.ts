import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { PackingListItem } from "../packing-list.models";
import { createReducer, on } from "@ngrx/store";
import { CreatePackingItemActions, DeletePackingItemActions, LoadPackingItemsActions } from "./packing-list.actions";

export interface PackingListState extends EntityState<PackingListItem> {
    isLoading: boolean;
    loadingError: string | null;
    tripId: number | null;

    isCreating: boolean;
    createError: string | null;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];
}

export const initialState: PackingListState = {
    ids: [],
    entities: {},
    isLoading: false,
    loadingError: null,
    tripId: null,

    isCreating: false,
    createError: null,

    deletingIds: [],
    deleteErrors: [],
};

export const adapter: EntityAdapter<PackingListItem> = createEntityAdapter<PackingListItem>();

export const packingListReducer = createReducer(
    initialState,
    on(LoadPackingItemsActions.loadPackingItems, (state, { tripId }) => ({
        ...state,
        isLoading: true,
        loadingError: null,
        tripId,
    })),
    on(LoadPackingItemsActions.loadPackingItemsSuccess, (state, { items }) =>
        adapter.setAll(items, {
            ...state,
            isLoading: false
        })
    ),
    on(LoadPackingItemsActions.loadPackingItemsFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        loadingError: error
    })),
    on(CreatePackingItemActions.createPackingItem, (state) => ({
        ...state,
        isCreating: true,
        createError: null
    })),
    on(CreatePackingItemActions.createPackingItemSuccess, (state, { item }) =>
        adapter.addOne(item, {
            ...state,
            isCreating: false
        })
    ),
    on(CreatePackingItemActions.createPackingItemFailure, (state, { error }) => ({
        ...state,
        isCreating: false,
        createError: error
    })),
    on(CreatePackingItemActions.clearCreateError, (state) => ({
        ...state,
        createError: null
    })),
    on(DeletePackingItemActions.deletePackingItem, (state, { id }) => ({
        ...state,
        deletingIds: [...state.deletingIds, id],
        deleteErrors: state.deleteErrors.filter(e => e.id !== id)
    })),
    on(DeletePackingItemActions.deletePackingItemSuccess, (state, { id }) => 
        adapter.removeOne(id, {
            ...state,
            deletingIds: state.deletingIds.filter(x => x !== id)
        })
    ),
    on(DeletePackingItemActions.deletePackingItemFailure, (state, { id, error }) => ({
        ...state,
        deletingIds: state.deletingIds.filter(x => x !== id),
        deleteErrors: [...state.deleteErrors, { id, message: error }]
    })),
    on(DeletePackingItemActions.clearDeleteError, (state, { id }) => ({
        ...state,
        deleteErrors: state.deleteErrors.filter(e => e.id !== id),
    })),
);