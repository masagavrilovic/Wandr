import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Expense, numberTransformer } from "./expense.entity";
import { User } from "../../user/entities/user.entity";


@Entity()
export class ExpenseParticipant {
    @PrimaryColumn()
    expenseId: number;

    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => Expense, (expense) => expense.participants, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'expenseId' })
    expense: Expense;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'bigint', transformer: numberTransformer })
    amount: number;
}