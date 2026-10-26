import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { PackingListItem } from "../packing-list.models";
import { createReducer, on } from "@ngrx/store";
import { CreatePackingItemActions, DeletePackingItemActions, LoadPackingItemsActions, TogglePackingItemActions, UpdatePackingItemActions } from "./packing-list.actions";
import { failedOp, initialOperation, loadingOp, OperationState, successOp } from "../../shared/store/operation-state";

export interface PackingListState extends EntityState<PackingListItem> {
    tripId: number | null;

    load: OperationState;
    create: OperationState;
    update: OperationState;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];

    togglingIds: number[];
    toggleErrors: { id: number; message: string }[];
}

export const initialState: PackingListState = {
    ids: [],
    entities: {},
    tripId: null,

    load: initialOperation,
    create: initialOperation,
    update: initialOperation,

    deletingIds: [],
    deleteErrors: [],

    togglingIds: [],
    toggleErrors: [],
};

export const adapter: EntityAdapter<PackingListItem> = createEntityAdapter<PackingListItem>();

const removeOneEntry = (ids: number[], id: number): number[] => {
    const index = ids.indexOf(id);
    return index === -1 ? ids : ids.filter((_, i) => i !== index);
};

export const packingListReducer = createReducer(
    initialState,
     on(LoadPackingItemsActions.loadPackingItems, (state, { tripId }) => {
        if (state.tripId !== tripId) {
            return adapter.removeAll({
                ...state,
                tripId,
                load: loadingOp(),
                create: initialOperation,
                update: initialOperation,
                deletingIds: [],
                deleteErrors: [],
                togglingIds: [],
                toggleErrors: [],
            });
        }
        return { ...state, load: loadingOp() };
    }),
    on(LoadPackingItemsActions.loadPackingItemsSuccess, (state, { items, tripId }) => {
        if (state.tripId !== tripId) return state;
        return adapter.setAll(items, { ...state, load: successOp() });
    }),
    on(LoadPackingItemsActions.loadPackingItemsFailure, (state, { error }) => ({
        ...state,
        load: failedOp(error)
    })),
    on(CreatePackingItemActions.createPackingItem, (state) => ({
        ...state,
        create: loadingOp()
    })),
    on(CreatePackingItemActions.createPackingItemSuccess, (state, { item, tripId }) => {
        if (state.tripId !== tripId) return state;
        return adapter.addOne(item, { ...state, create: successOp() });
    }),
    on(CreatePackingItemActions.createPackingItemFailure, (state, { error }) => ({
        ...state,
        create: failedOp(error)
    })),
    on(CreatePackingItemActions.clearCreateError, (state) => ({
        ...state,
        create: initialOperation
    })),
    on(UpdatePackingItemActions.updatePackingItem, (state) => ({
        ...state,
        update: loadingOp()
    })),
    on(UpdatePackingItemActions.updatePackingItemSuccess, (state, { item, tripId }) => {
        if (state.tripId !== tripId) return state;
        return adapter.updateOne({ id: item.id, changes: item }, { ...state, update: successOp() });
    }),
    on(UpdatePackingItemActions.updatePackingItemFailure, (state, { error }) => ({
        ...state,
        update: failedOp(error),
    })),
    on(UpdatePackingItemActions.clearPackingItemError, (state) => ({
        ...state,
        update: initialOperation,
    })),
    on(DeletePackingItemActions.deletePackingItem, (state, { id }) => ({
        ...state,
        deletingIds: [...state.deletingIds, id],
        deleteErrors: state.deleteErrors.filter((e) => e.id !== id),
    })),
    on(DeletePackingItemActions.deletePackingItemSuccess, (state, { id, tripId }) => {
        if (state.tripId !== tripId) return state;
        return adapter.removeOne(id, {
            ...state,
            deletingIds: state.deletingIds.filter((x) => x !== id),
        });
    }),
    on(DeletePackingItemActions.deletePackingItemFailure, (state, { id, error }) => ({
        ...state,
        deletingIds: state.deletingIds.filter((x) => x !== id),
        deleteErrors: [...state.deleteErrors, { id, message: error }],
    })),
    on(DeletePackingItemActions.clearDeleteError, (state, { id }) => ({
        ...state,
        deleteErrors: state.deleteErrors.filter((e) => e.id !== id),
    })),
    on(TogglePackingItemActions.togglePackingItem, (state, { id, assignedTo }) =>
        adapter.updateOne({ id, changes: { assignedTo } }, {
            ...state,
            togglingIds: [...state.togglingIds, id],
            toggleErrors: state.toggleErrors.filter((e) => e.id !== id),
        })
    ),
    on(TogglePackingItemActions.togglePackingItemSuccess, (state, { item, tripId }) => {
        if (state.tripId !== tripId) return state;
        const togglingIds = removeOneEntry(state.togglingIds, item.id);
        const next = { ...state, togglingIds };
        return togglingIds.includes(item.id)
            ? next
            : adapter.updateOne({ id: item.id, changes: item }, next);
    }),
    on(TogglePackingItemActions.togglePackingItemFailure, (state, { id, previousAssignedTo, error }) => {
        if (!state.entities[id]) return state;
        return adapter.updateOne({ id, changes: { assignedTo: previousAssignedTo } }, {
            ...state,
            togglingIds: removeOneEntry(state.togglingIds, id),
            toggleErrors: [...state.toggleErrors, { id, message: error }],
        });
    }),
    on(TogglePackingItemActions.clearToggleError, (state, { id }) => ({
        ...state,
        toggleErrors: state.toggleErrors.filter((e) => e.id !== id),
    })),
);