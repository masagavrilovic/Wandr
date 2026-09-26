import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trip } from "../../trip/entities/trip.entity";
import { User } from "../../user/entities/user.entity";

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

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assignedToId' })
    assignedTo?: User;

    @Column({ nullable: true })
    assignedToId?: number;
}
