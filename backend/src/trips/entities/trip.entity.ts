import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Trip {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({nullable: true})
    imageUrl: string;

    @ManyToOne(() => User, (user) => user.ownedTrips, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'ownerId' })
    owner: User

    @Column()
    ownerId: number;

    @ManyToMany(() => User, (user) => user.trips)
    @JoinTable({
        name: 'trip_members',
        joinColumn: { name: 'tripId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
    })
    members: User[];
}
