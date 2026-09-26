import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackingListItemDto } from './dto/create-packing-list.dto';
import { UpdatePackingListItemDto } from './dto/update-packing-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PackingList, PackingListItem } from './entities/packing-list.entity';
import { Repository } from 'typeorm';
import { TripService } from '../trip/trip.service';
import { PackingListItemResponseDto } from './dto/packing-list-response.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PackingListService {
  constructor(
    @InjectRepository(PackingListItem)
    private readonly packingListItemRepository: Repository<PackingListItem>,
    private readonly tripService: TripService,
  ) {}

  private async findAccessibleItem(userId: number, tripId: number, id: number): Promise<PackingListItem> {
    await this.tripService.ensureTripAccess(tripId, userId);

    const item = await this.packingListItemRepository.findOne({
      where: { id, tripId },
      relations: { assignedTo: true },
    });

    if (!item) throw new NotFoundException('Packing list item not found');

    if (item.listType === PackingList.PERSONAL && item.ownerId !== userId) {
      throw new NotFoundException('Packing list item not found');
    }

    return item;
  }

  async create(userId: number, tripId: number, createPackingListItemDto: CreatePackingListItemDto): Promise<PackingListItemResponseDto> {
    await this.tripService.ensureTripAccess(tripId, userId);

    const newPackingListItem = this.packingListItemRepository.create({
      ...createPackingListItemDto,
      tripId,
      ownerId: createPackingListItemDto.listType === PackingList.PERSONAL ? userId : undefined
    });
    const savedPackingListItem = await this.packingListItemRepository.save(newPackingListItem);
    return new PackingListItemResponseDto(savedPackingListItem);
  }

  async findAll(userId: number, tripId: number): Promise<PackingListItemResponseDto[]> {
    await this.tripService.ensureTripAccess(tripId, userId);

     const items = await this.packingListItemRepository.find({
      where: [
        { tripId, listType: PackingList.SHARED },
        { tripId, listType: PackingList.PERSONAL, ownerId: userId },
      ],
      relations: { assignedTo: true },
      order: { id: 'ASC' },
    });

    return items.map((item) => new PackingListItemResponseDto(item));
  }

  async findOne(userId: number, tripId: number, id: number): Promise<PackingListItemResponseDto> {
    const item = await this.findAccessibleItem(userId, tripId, id);
    return new PackingListItemResponseDto(item);
  }

  async update(userId: number, tripId: number, id: number, updatePackingListItemDto: UpdatePackingListItemDto) {
    const item = await this.findAccessibleItem(userId, tripId, id);
    if (updatePackingListItemDto.assignedToId !== undefined && updatePackingListItemDto.assignedToId !== null && updatePackingListItemDto.assignedToId !== userId) {
      throw new ForbiddenException('You can only assign yourself to an item');
    }
    
    Object.assign(item, updatePackingListItemDto);
    if (updatePackingListItemDto.assignedToId !== undefined) {
      item.assignedTo = updatePackingListItemDto.assignedToId === null ? undefined : ({ id: updatePackingListItemDto.assignedToId } as User);
    }
    await this.packingListItemRepository.save(item);

    const freshItem = await this.packingListItemRepository.findOneOrFail({
      where: { id },
      relations: { assignedTo: true },
    });

    return new PackingListItemResponseDto(freshItem);
  }

  async remove(userId: number, tripId: number, id: number) {
    const item = await this.findAccessibleItem(userId, tripId, id);
    await this.packingListItemRepository.remove(item);
  }
}
