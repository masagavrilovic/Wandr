import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Activity } from "../../activity/entities/activity.entity";

export enum TripStatus {
    PLANNING = 'Planning',
    ONGOING = 'Ongoing',
    FINISHED = 'Finished',
    CANCELED = 'Canceled',
}

@Entity()
export class Trip {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    destination: string;

    @Column({type: 'decimal',precision: 10, scale: 7 })
    latitude: number;

    @Column({type: 'decimal', precision: 10, scale: 7 })
    longitude: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ type: 'varchar', nullable: true})
    imagePath?: string | null;

    @Column({ type: 'enum', enum: TripStatus, default: TripStatus.PLANNING })
    status: TripStatus;

    @Column({ unique: true })
    inviteCode: string;

    @ManyToOne(() => User, (user) => user.ownedTrips, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @Column()
    ownerId: number;

    @ManyToMany(() => User, (user) => user.trips)
    @JoinTable({
        name: 'trip_members',
        joinColumn: { name: 'tripId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
    })
    members: User[];

    @OneToMany(() => Activity, (activity) => activity.trip)
    activities: Activity[];

}
