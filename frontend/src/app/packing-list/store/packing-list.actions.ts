import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CreatePackingListItemPayload, PackingListItem, UpdatePackingListItemPayload } from "../packing-list.models";
import { PackingItem } from "../packing-item/packing-item";

export const LoadPackingItemsActions = createActionGroup({
    source: 'Packing List',
    events: {
        'Load Packing Items': props<{ tripId: number }>(),
        'Load Packing Items Success': props<{ items: PackingListItem[] }>(),
        'Load Packing Items Failure': props<{ error: string }>(),

    }
});

export const CreatePackingItemActions = createActionGroup({
    source: 'Packing List',
    events: {
        'Create Packing Item': props<{ tripId: number, payload: CreatePackingListItemPayload }>(),
        'Create Packing Item Success': props<{ item: PackingListItem, tripId: number }>(),
        'Create Packing Item Failure': props<{ error: string }>(),
        'Clear Create Error': emptyProps(),
    }
});

export const UpdatePackingItemActions = createActionGroup({
  source: 'Packing List',
  events: {
    'Update PackingItem': props<{ tripId: number, id: number, payload: UpdatePackingListItemPayload }>(),
    'Update PackingItem Success': props<{ item: PackingListItem, tripId: number}>(),
    'Update PackingItem Failure': props<{ error: string}>(),
    'Clear PackingItem Error': emptyProps(),
  }
});

export const DeletePackingItemActions = createActionGroup({
    source: 'Packing List',
    events: {
        'Delete Packing Item': props<{ tripId: number, id: number }>(),
        'Delete Packing Item Success': props<{ id: number}>(),
        'Delete Packing Item Failure': props<{ id: number, error: string }>(),
        'Clear Delete Error': props<{ id: number }>(),
    }
})