import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { TripService } from '../trip/trip.service';
import { MessageResponseDto } from './dto/message-response.dto';

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

  async findAll(userId: number, tripId: number): Promise<MessageResponseDto[]> {
    await this.tripService.ensureTripAccess(tripId, userId);

    const msgs = await this.messagesRepository.find({ 
      where: { tripId },
      relations: { sender: true },
      order: { createdAt: 'ASC', id: 'ASC' },
      withDeleted: true,
     });
    return msgs.map((m) => new MessageResponseDto(m));
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
