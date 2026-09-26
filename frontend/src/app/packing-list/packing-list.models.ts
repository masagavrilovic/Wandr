import { UserSummary } from "../user/user.models";

export enum PackingCategory {
  DOCUMENTS_AND_MONEY = 'Documents & Money',
  CLOTHING_AND_FOOTWEAR = 'Clothing & Footwear',
  PERSONAL_HYGIENE = 'Personal Hygiene',
  HEALTH_AND_PHARMACY = 'Health & Pharmacy',
  ELECTRONICS = 'Electronics',
  EQUIPMENT = 'Shared Equipment',
  FOOD_AND_DRINKS = 'Food & Drinks',
  ACTIVITIES_AND_GEAR = 'Activities & Gear',
  KIDS_AND_PETS = 'Kids & Pets',
  MISCELLANEOUS = 'Miscellaneous',
}

export enum PackingList {
    PERSONAL = 'personal',
    SHARED = 'shared',
}

export interface PackingListItem {
    id: number;
    listType: PackingList;
    text: string;
    category: PackingCategory;
    assignedTo: UserSummary | null;
}

export interface CreatePackingListItemPayload {
  text: string;
  listType: PackingList;
  category: PackingCategory;
}

export interface UpdatePackingListItemPayload {
  text?: string;
  assignedToId?: number | null;
  category?: PackingCategory;
}