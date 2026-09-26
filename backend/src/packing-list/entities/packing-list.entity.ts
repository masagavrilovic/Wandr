import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trip } from "../../trip/entities/trip.entity";
import { User } from "../../user/entities/user.entity";

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
    SHARED = 'shared'
}

@Entity()
export class PackingListItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Trip, { onDelete: 'CASCADE'})
    trip: Trip;

    @Column()
    tripId: number;

    @Column({ type: 'enum', enum: PackingList })
    listType: PackingList;

    @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ownerId' })
    owner?: User;

    @Column({ nullable: true })
    ownerId: number;

    @Column()
    text: string;

    @Column({ type: 'enum', enum: PackingCategory, default: PackingCategory.MISCELLANEOUS })
    category: PackingCategory;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assignedToId' })
    assignedTo?: User;

    @Column({ nullable: true })
    assignedToId?: number;
}
