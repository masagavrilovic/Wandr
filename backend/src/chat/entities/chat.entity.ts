import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Trip } from "../../trip/entities/trip.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tripId'})
    trip: Trip;

    @Column()
    tripId: number;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'senderId' })
    sender?: User | null;

    @Column({ nullable: true })
    senderId: number | null;

    @Column('text')
    content: string;

    @CreateDateColumn() 
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
    @DeleteDateColumn() 
    deletedAt: Date | null;
}
