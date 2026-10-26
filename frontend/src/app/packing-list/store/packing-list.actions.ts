import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CreatePackingListItemPayload, PackingListItem, UpdatePackingListItemPayload } from "../packing-list.models";
import { UserSummary } from "../../user/user.models";

export const PackingTabActions = createActionGroup({
    source: 'Packing Tab',
    events: {
        'Opened': emptyProps(),
    }
});


export const LoadPackingItemsActions = createActionGroup({
    source: 'Packing List',
    events: {
        'Load Packing Items': props<{ tripId: number }>(),
        'Load Packing Items Success': props<{ items: PackingListItem[], tripId: number }>(),
        'Load Packing Items Failure': props<{ error: string }>(),

    }
});

export const CreatePackingItemActions = createActionGroup({
    source: 'Packing List',
    events: {
        'Create Packing Item': props<{ payload: CreatePackingListItemPayload }>(),
        'Create Packing Item Success': props<{ item: PackingListItem, tripId: number }>(),
        'Create Packing Item Failure': props<{ error: string }>(),
        'Clear Create Error': emptyProps(),
    }
});

export const UpdatePackingItemActions = createActionGroup({
  source: 'Packing List',
  events: {
    'Update PackingItem': props<{ id: number, payload: UpdatePackingListItemPayload }>(),
    'Update PackingItem Success': props<{ item: PackingListItem, tripId: number}>(),
    'Update PackingItem Failure': props<{ error: string}>(),
    'Clear PackingItem Error': emptyProps(),
  }
});

export const DeletePackingItemActions = createActionGroup({
    source: 'Packing List',
    events: {
        'Delete Packing Item': props<{ id: number }>(),
        'Delete Packing Item Success': props<{ id: number, tripId: number }>(),
        'Delete Packing Item Failure': props<{ id: number, error: string }>(),
        'Clear Delete Error': props<{ id: number }>(),
    }
});

export const TogglePackingItemActions = createActionGroup({
  source: 'Packing List',
  events: {
    'Toggle Packing Item': props<{
      id: number;
      assigned: boolean;
      assignedTo: UserSummary | null;
      previousAssignedTo: UserSummary | null;
    }>(),
    'Toggle Packing Item Success': props<{ item: PackingListItem, tripId: number }>(),
    'Toggle Packing Item Failure': props<{ id: number, previousAssignedTo: UserSummary | null, error: string }>(),
    'Clear Toggle Error': props<{ id: number }>(),
  }
});