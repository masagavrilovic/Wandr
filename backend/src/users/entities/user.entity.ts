import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';

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

  @OneToMany(() => Trip, (trip) => trip.owner)
  ownedTrips: Trip[];

  @ManyToMany(() => Trip, (trip) => trip.members)
  trips: Trip[];
}
