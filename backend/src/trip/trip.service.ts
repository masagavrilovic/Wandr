import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Repository } from 'typeorm';
import { TripResponseDto } from './dto/trip-response.dto';
import { User } from '../user/entities/user.entity';
import { customAlphabet } from 'nanoid';

@Injectable()
export class TripService {
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

  private async generateUniqueInviteCode(): Promise<string> {
    const generateCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 7);
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCode();
      const exists = await this.tripsRepository.findOneBy({ inviteCode: code });
      if (!exists) return code;
    }
    throw new Error('Failed to generate unique invite code after multiple attempts');
  }
  
  async create(ownerId: number, createTripDto: CreateTripDto): Promise<TripResponseDto> {
    this.validateDates(createTripDto.startDate, createTripDto.endDate);
    const owner = await this.usersRepository.findOneBy({ id: ownerId });
    if (!owner) throw new NotFoundException('Owner not found');

    const inviteCode = await this.generateUniqueInviteCode();

    const newTrip = this.tripsRepository.create({
      ...createTripDto,
      startDate: new Date(createTripDto.startDate),
      endDate: new Date(createTripDto.endDate),
      ownerId,
      owner,
      members: [owner],
      inviteCode
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
    const trip = await this.tripsRepository.findOne({
      where: {id},
      relations: {owner: true, members: true }
     });
    if (!trip) throw new NotFoundException('Trip not found');

    const isMember = trip.members.some((m) => m.id === userId);
    if (!isMember) throw new ForbiddenException('Not allowed to view this trip');
  
    return new TripResponseDto(trip);
  }

  async update(id: number, updateTripDto: UpdateTripDto, userId: number): Promise<TripResponseDto> {
    const trip = await this.tripsRepository.findOneBy({ id });
    if (!trip) throw new NotFoundException('Trip not found');

    const isMember = await this.tripsRepository.exists({
      where: { id, members: { id: userId } },
    });
    if (!isMember) throw new ForbiddenException('Not allowed to update this trip');

    const { startDate, endDate, ...rest } = updateTripDto;

    const newStart = startDate ? new Date(startDate) : trip.startDate;
    const newEnd = endDate ? new Date(endDate) : trip.endDate;
    this.validateDates(newStart, newEnd);

    Object.assign(trip, rest);
    trip.startDate = newStart;
    trip.endDate = newEnd;

    const savedTrip = await this.tripsRepository.save(trip);
    return new TripResponseDto(savedTrip);
  }

  async remove(id: number, userId: number) {
    const trip = await this.tripsRepository.findOneBy({ id });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.ownerId !== userId) throw new ForbiddenException('Not allowed to delete this trip');

    await this.tripsRepository.delete(id);
  }

  async joinTrip(userId: number, code: string) {
    const normalizedCode = code.trim().toUpperCase();
    const trip = await this.tripsRepository.findOne({
      where: { inviteCode: normalizedCode },
      relations: { owner: true, members: true },
    });

    if (!trip) throw new NotFoundException('Invalid invite code');

    const alreadyMember = trip.members.some((m) => m.id === userId);
    if (alreadyMember) return new TripResponseDto(trip);

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    trip.members.push(user);
    const savedTrip = await this.tripsRepository.save(trip);
    return new TripResponseDto(savedTrip);
  }
}
