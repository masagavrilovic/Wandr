import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trip } from "../../trip/entities/trip.entity";

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

    @Column({ nullable: true })
    notes?: string;

    @ManyToOne(() => Trip, (trip) => trip.activities, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'tripId' })
    trip: Trip;

    @Column()
    tripId: number;
}
