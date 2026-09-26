import { createActionGroup, props } from "@ngrx/store";
import { PackingListItem } from "../packing-list.models";

export const LoadPackingItemsActions = createActionGroup({
    source: 'Packing List',
    events: {
        'Load Packing Items': props<{ tripId: number }>(),
        'Load Packing Items Success': props<{ items: PackingListItem[] }>(),
        'Load Packing Items Failure': props<{ error: string }>(),

    }
});