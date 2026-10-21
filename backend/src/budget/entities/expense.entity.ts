import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Trip } from "../../trip/entities/trip.entity";
import { User } from "../../user/entities/user.entity";
import { ExpenseParticipant } from "./expense-participant.entity";

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

export const numberTransformer = {
    to: (value?: number | null) => value,
    from: (value?: string | null) => (value === null || value === undefined ? value : Number(value)),
};

@Entity()
export class Expense {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tripId'})
    trip: Trip;

    @Column()
    tripId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'paidById' })
    paidBy: User;

    @Column()
    paidById: number;

    @Column()
    paidAt: Date;

    @Column()
    description: string;

    @Column({ type: 'bigint', transformer: numberTransformer })
    amountMinor: number;

    @Column({ type: 'char', length: 3 })
    currency: string;

    @Column({ type: 'bigint', transformer: numberTransformer, nullable: true })
    baseAmountMinor: number;

    @Column({ type: 'numeric', precision: 24, scale: 12, transformer: numberTransformer, nullable: true })
    exchangeRate: number;

    @Column({ type: 'enum', enum: ExpenseCategory, default: ExpenseCategory.OTHER })
    category: ExpenseCategory;
    
    @OneToMany(() => ExpenseParticipant, (participant) => participant.expense, { cascade: true })
    participants: ExpenseParticipant[];
}
