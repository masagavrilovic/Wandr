import { ExpenseCategory } from "./expenses.models";


export interface ExpenseCategoryMeta {
  icon: string;
  color: string;
}

export const EXPENSE_CATEGORY_META: Record<ExpenseCategory, ExpenseCategoryMeta> = {
  [ExpenseCategory.ACCOMMODATION]: { icon: 'hotel', color: '#8E24AA' },
  [ExpenseCategory.CITY_TAX]: { icon: 'receipt_long', color: '#8E24AA' },

  [ExpenseCategory.RESTAURANTS_CAFES]: { icon: 'restaurant', color: '#708238' },
  [ExpenseCategory.GROCERIES]: { icon: 'shopping_cart', color: '#708238' },
  [ExpenseCategory.BARS_NIGHTLIFE]: { icon: 'local_bar', color: '#708238' },

  [ExpenseCategory.FLIGHTS]: { icon: 'flight', color: '#CE2D4F' },
  [ExpenseCategory.PUBLIC_TRANSPORT]: { icon: 'directions_transit', color: '#CE2D4F' },
  [ExpenseCategory.TAXI_RIDESHARE]: { icon: 'local_taxi', color: '#CE2D4F' },
  [ExpenseCategory.CAR_RENTAL]: { icon: 'car_rental', color: '#CE2D4F' },
  [ExpenseCategory.GAS_TOLLS]: { icon: 'local_gas_station', color: '#CE2D4F' },
  [ExpenseCategory.PARKING]: { icon: 'local_parking', color: '#CE2D4F' },

  [ExpenseCategory.TICKETS_ATTRACTIONS]: { icon: 'confirmation_number', color: '#30B2A9' },
  [ExpenseCategory.TOURS_EXCURSIONS]: { icon: 'tour', color: '#30B2A9' },
  [ExpenseCategory.SPORTS_RENTALS]: { icon: 'downhill_skiing', color: '#30B2A9' },

  [ExpenseCategory.SHOPPING]: { icon: 'shopping_bag', color: '#F4C430' },
  [ExpenseCategory.SOUVENIRS]: { icon: 'card_giftcard', color: '#F4C430' },

  [ExpenseCategory.INSURANCE]: { icon: 'health_and_safety', color: '#005B94' },
  [ExpenseCategory.VISA_FEES]: { icon: 'badge', color: '#005B94' },
  [ExpenseCategory.SIM_INTERNET]: { icon: 'sim_card', color: '#005B94' },
  [ExpenseCategory.HEALTH_PHARMACY]: { icon: 'medication', color: '#005B94' },

  [ExpenseCategory.OTHER]: { icon: 'payments', color: '#fa5b5b' },
};

export function getExpenseCategoryMeta(category: string): ExpenseCategoryMeta {
  return EXPENSE_CATEGORY_META[category as ExpenseCategory] || EXPENSE_CATEGORY_META[ExpenseCategory.OTHER];
}