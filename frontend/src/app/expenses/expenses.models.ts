export enum ExpenseCategory {
  ACCOMMODATION = 'Accommodation',
  CITY_TAX = 'CityTax',
  RESTAURANTS_CAFES = 'Restaurants & Cafes',
  GROCERIES = 'Groceries',
  BARS_NIGHTLIFE = 'Bars & Nightlife',
  FLIGHTS = 'Flights',
  PUBLIC_TRANSPORT = 'Public Transport',
  TAXI_RIDESHARE = 'Taxi & Rideshare',
  CAR_RENTAL = 'Car Rental',
  GAS_TOLLS = 'Gas Tolls',
  PARKING = 'Parking',
  TICKETS_ATTRACTIONS = 'Tickets & Attractions',
  TOURS_EXCURSIONS = 'Tours & Excursions',
  SPORTS_RENTALS = 'Sports & Rentals',
  SHOPPING = 'Shopping',
  SOUVENIRS = 'Souvenirs',
  INSURANCE = 'Insurance',
  VISA_FEES = 'Visa Fees',
  SIM_INTERNET = 'Sim & Internet',
  HEALTH_PHARMACY = 'Health & Pharmacy',
  OTHER = 'Other'
}

export interface Expense {
    id: number;
    description: string;
    paidAt: string;
    paidById: number;
    amount: number;
    currency: string;
    baseAmount: number;
    baseCurrency: string;
    exchangeRate: number;
    category: ExpenseCategory;
    participantIds: number[];
}

export interface CreateExpensePayload {
    description: string;
    paidAt: string;
    amount: number;
    currency: string;
    exchangeRate?: number;
    category?: ExpenseCategory;
    participantIds?: number[];
}

export interface UpdateExpensePayload {
    description?: string;
    paidAt?: string;
    amount?: number;
    currency?: string;
    exchangeRate?: number;
    category?: ExpenseCategory;
    participantIds?: number[];
}