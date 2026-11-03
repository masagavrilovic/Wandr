import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripModule } from '../trip/trip.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), TripModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
