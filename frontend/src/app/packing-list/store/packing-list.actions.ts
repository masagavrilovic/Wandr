import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CreatePackingListItemPayload, PackingListItem } from "../packing-list.models";
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