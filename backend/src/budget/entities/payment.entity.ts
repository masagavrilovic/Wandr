import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Trip } from '../../trip/entities/trip.entity';
import { User } from '../../user/entities/user.entity';
import { numberTransformer } from './expense.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tripId: number;

  @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column()
  fromUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @Column()
  toUserId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  @Column()
  paidAt: Date;

  @Column({ type: 'bigint', transformer: numberTransformer })
  amountMinor: number;

  @Column({ type: 'char', length: 3 })
  currency: string;

  @Column({ type: 'bigint', transformer: numberTransformer })
  baseAmountMinor: number;

  @Column({ type: 'numeric', precision: 24, scale: 12, transformer: numberTransformer })
  exchangeRate: number;
}