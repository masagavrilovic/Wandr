import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trip } from "../../trip/entities/trip.entity";
import { User } from "../../user/entities/user.entity";

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

    @ManyToOne(() => User)
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

    @ManyToMany(() => User)
    @JoinTable({
        name: 'expense_participants',
        joinColumn: { name: 'expenseId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
    })
    participants: User[];
}
