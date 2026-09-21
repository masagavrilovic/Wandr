import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trip } from "../../trip/entities/trip.entity";

export enum ActivityCategory {
  RESTAURANT = 'Restaurant',
  CAFE = 'Cafe',
  BAR_NIGHTLIFE = 'Bar & Nightlife',
  STREET_FOOD = 'Street Food',
  GASTRONOMY_EXPERIENCE = 'Gastronomy Experience',

  MUSEUM = 'Museum',
  HISTORICAL_SITE = 'Historical Site',
  RELIGIOUS_SITE = 'Religious Site',
  VIEWPOINT = 'Viewpoint',

  PARK_GARDEN = 'Park & Garden',
  BEACH = 'Beach',
  NATURE_RESERVE = 'Nature Reserve',
  HIKING = 'Hiking',

  CONCERT_SHOW = 'Concert & Show',
  AMUSEMENT_PARK = 'Amusement Park',
  EVENT_FESTIVAL = 'Event & Festival',

  GUIDED_TOUR = 'Guided Tour',
  DAY_TRIP = 'Day Trip',
  WATER_ACTIVITY = 'Water Activity',
  WORKSHOP_CLASS = 'Workshop & Class',

  SHOPPING = 'Shopping',
  LOCAL_MARKET = 'Local Market',

  ACCOMMODATION = 'Accommodation',
  WELLNESS_SPA = 'Wellness & Spa',

  TRANSPORT = 'Transport',
  CAR_RENTAL = 'Car Rental',

  OTHER = 'Other',
}

@Entity()
export class Activity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column({ type: 'date', nullable: true })
    date?: string;

    @Column({ type: 'time', nullable: true })
    time?: string;

    @Column({ nullable: true })
    address?: string;

    @Column({type: 'decimal',precision: 10, scale: 7, nullable: true })
    latitude?: number;

    @Column({type: 'decimal', precision: 10, scale: 7, nullable: true })
    longitude?: number;

    @Column({ type: 'enum', enum: ActivityCategory, default: ActivityCategory.OTHER})
    category: ActivityCategory;

    @Column({ nullable: true })
    notes?: string;

    @ManyToOne(() => Trip, (trip) => trip.activities, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'tripId' })
    trip: Trip;

    @Column()
    tripId: number;
}
