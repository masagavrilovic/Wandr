import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message } from './entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripModule } from '../trip/trip.module';
import { User } from '../user/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ReadState } from './entities/read-state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, ReadState]), TripModule, JwtModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
