import { UserSummary } from "../user/user.models";

export enum PackingList {
    PERSONAL = 'personal',
    SHARED = 'shared',
}

export interface PackingListItem {
    id: number;
    listType: PackingList;
    text: string;
    assignedTo: UserSummary | null;
}

export interface CreatePackingListItemPayload {
  text: string;
  listType: PackingList;
}

export interface UpdatePackingListItemPayload {
  text?: string;
  assignedToId?: number | null;
}