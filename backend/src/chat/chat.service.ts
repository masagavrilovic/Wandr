import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/chat.entity';
import { LessThan, Repository } from 'typeorm';
import { TripService } from '../trip/trip.service';
import { MessageResponseDto } from './dto/message-response.dto';
import { CursorPaginationQueryDto } from '../common/dto/cursor-pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly tripService: TripService,
  ) {}

  async create(userId: number, tripId: number, createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    await this.tripService.ensureTripAccess(tripId, userId);
    
    const newMsg = this.messagesRepository.create({
      ...createMessageDto,
      tripId,
      senderId: userId
    })
    const savedMsg = await this.messagesRepository.save(newMsg);

    const full = await this.messagesRepository.findOneOrFail({
      where: { id: savedMsg.id },
      relations: { sender: true },
    });
    return new MessageResponseDto(full);
  }

  async findAll(userId: number, tripId: number, query: CursorPaginationQueryDto): Promise<PaginatedResponseDto<MessageResponseDto>> {
    await this.tripService.ensureTripAccess(tripId, userId);

    const { limit = 10, cursor } = query;

    const msgs = await this.messagesRepository.find({ 
      where: cursor ? { tripId, id: LessThan(cursor) } : { tripId },
      relations: { sender: true },
      order: { id: 'DESC' },
      take: limit + 1,
      withDeleted: true,
     });

    const hasNextPage = msgs.length > limit;
    if (hasNextPage) msgs.pop();

    msgs.reverse(); 
    const nextCursor = hasNextPage ? msgs[0].id : null;
    const data = msgs.map((m) => new MessageResponseDto(m));
    return new PaginatedResponseDto(data, nextCursor, hasNextPage);
  }

  async findOne(userId: number, tripId: number, id: number): Promise<MessageResponseDto> {
    await this.tripService.ensureTripAccess(tripId, userId);

    const msg = await this.messagesRepository.findOne({ where: { tripId, id } });
    if (!msg) throw new NotFoundException('Message not found');
    return  new MessageResponseDto(msg);
  }

  async remove(userId: number, tripId: number, id: number) {
    await this.tripService.ensureTripAccess(tripId, userId);
    const msg = await this.messagesRepository.findOne({
      where: { id, tripId },
      relations: { sender: true },
    });
    if (!msg || msg.senderId !== userId) throw new NotFoundException('Message not found');
    
    await this.messagesRepository.softDelete({ id, tripId });
    msg.deletedAt = new Date();
    return new MessageResponseDto(msg);
  }
}
