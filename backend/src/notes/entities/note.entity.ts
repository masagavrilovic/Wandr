import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Trip } from "../../trip/entities/trip.entity";

export enum NoteColor {
  DEFAULT = 'default',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
  PINK = 'pink',
  PURPLE = 'purple',
}

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    content?: string;

    @Column({ type: 'enum', enum: NoteColor, default: NoteColor.DEFAULT })
    color: NoteColor;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tripId'})
    trip: Trip;

    @Column()
    tripId: number;
}
