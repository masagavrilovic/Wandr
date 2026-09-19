import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { Trip } from '../../trip/entities/trip.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'varchar', length: 64, nullable: true, select: false })
    refreshTokenHash: string | null;

    @OneToMany(() => Trip, (trip) => trip.owner)
    ownedTrips: Trip[];

    @ManyToMany(() => Trip, (trip) => trip.members)
    trips: Trip[];

}
