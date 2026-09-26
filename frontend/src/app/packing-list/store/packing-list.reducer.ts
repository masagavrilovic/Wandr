import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { PackingListItem } from "../packing-list.models";
import { createReducer, on } from "@ngrx/store";
import { CreatePackingItemActions, LoadPackingItemsActions } from "./packing-list.actions";

export interface PackingListState extends EntityState<PackingListItem> {
    isLoading: boolean;
    loadingError: string | null;
    tripId: number | null;

    isCreating: boolean;
    createError: string | null;
}

export const initialState: PackingListState = {
    ids: [],
    entities: {},
    isLoading: false,
    loadingError: null,
    tripId: null,

    isCreating: false,
    createError: null,
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
);