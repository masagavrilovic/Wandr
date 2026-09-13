import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { TripResponseDto } from './dto/response-trip.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}
  
  private validateDates(startDate: string | Date, endDate: string | Date) {
    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException('Start date must be before end date');
    }
  }
  
  async create(ownerId: number, createTripDto: CreateTripDto): Promise<TripResponseDto> {
    this.validateDates(createTripDto.startDate, createTripDto.endDate);
    const owner = await this.usersRepository.findOneBy({ id: ownerId});
    if (!owner) throw new NotFoundException('Owner not found');

    const newTrip = this.tripsRepository.create({
      ...createTripDto,
      ownerId,
      owner,
      members: [owner]
    });

    const savedTrip = await this.tripsRepository.save(newTrip);
    return new TripResponseDto(savedTrip);
  }

  async findAllForUser(userId: number): Promise<TripResponseDto[]> {
    const trips = await this.tripsRepository.find({
      where: { members: { id: userId }},
      relations: { owner: true, members: true }
    })

    return trips.map((trip) => new TripResponseDto(trip));
  }

  async findOne(id: number, userId: number): Promise<TripResponseDto> {
    const trip = await this.tripsRepository.findOneBy({ id });
    if (!trip) throw new NotFoundException('Trip not found');

    const isMember = trip.members.some((m) => m.id === userId);
    if (!isMember) throw new ForbiddenException('Not allowed to view this trip');
  
    return new TripResponseDto(trip);
  }

  async update(id: number, updateTripDto: UpdateTripDto, userId: number): Promise<TripResponseDto> {
    const trip = await this.tripsRepository.findOneBy({ id });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.ownerId !== userId) throw new ForbiddenException('Not allowed to edit this trip');
    if (updateTripDto.startDate || updateTripDto.endDate) {
      this.validateDates(updateTripDto.startDate || trip.startDate, updateTripDto.endDate || trip.endDate);
    }

    if (updateTripDto.name !== undefined) trip.name = updateTripDto.name;
    if (updateTripDto.startDate !== undefined) trip.startDate = new Date(updateTripDto.startDate);
    if (updateTripDto.endDate !== undefined) trip.endDate = new Date(updateTripDto.endDate);
    if (updateTripDto.imageUrl !== undefined) trip.imageUrl = updateTripDto.imageUrl;

    const savedTrip = await this.tripsRepository.save(trip);
    return new TripResponseDto(savedTrip);
  }

  async remove(id: number, userId: number) {
    const trip = await this.tripsRepository.findOneBy({ id });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.ownerId !== userId) throw new ForbiddenException('Not allowed to delete this trip');

    await this.tripsRepository.delete(id);
  }
}
