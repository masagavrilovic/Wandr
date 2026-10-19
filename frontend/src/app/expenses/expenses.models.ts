import { UserSummary } from "../user/user.models";

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

export interface ExpenseParticipant {
    user: UserSummary;
    amountMinor: number;
}

export interface Expense {
    id: number;
    description: string;
    paidAt: string;
    paidBy: UserSummary;
    amount: number;
    currency: string;
    baseAmount: number;
    baseAmountMinor: number;
    baseCurrency: string;
    exchangeRate: number;
    category: ExpenseCategory;
    participantIds: number[];
    participants: ExpenseParticipant[];
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

export interface Payment {
    id: number;
    from: UserSummary;
    to: UserSummary;
    amount: number;
    amountMinor: number;
    baseCurrency: string;
    createdAt: string;
}

export interface CreatePaymentPayload {
    toUserId: number;
    amount: number;
}