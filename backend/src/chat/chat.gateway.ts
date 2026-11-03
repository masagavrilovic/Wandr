import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Namespace, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { TripService } from '../trip/trip.service';
import { User } from '../user/entities/user.entity';
import { UserSummaryDto } from '../user/dto/user-response.dto';
import { ChatService } from './chat.service';
import { ChatRoomDto } from './dto/chat-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { ChatExceptionFilter } from './chat-exception.filter';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@UseFilters(new ChatExceptionFilter())
@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: 'http://localhost:4200', credentials: true },
})
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() server: Namespace;

  constructor(
    private readonly chatService: ChatService,
    private readonly tripService: TripService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  afterInit(namespace: Namespace) {
    namespace.use(async (socket, next) => {
      try {
        const token = parse(socket.handshake.headers.cookie ?? '')['access_token'];
        if (!token) throw new Error('no token');

        const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
          secret: this.config.getOrThrow<string>('JWT_SECRET'),
        });
        const user = await this.usersRepository.findOneBy({ id: payload.sub });
        if (!user) throw new Error('no user');

        socket.data.userId = user.id;
        socket.data.user = new UserSummaryDto(user);
        next();
      } catch {
        next(new Error('Unauthorized'));
      }
    });
  }

  private room(tripId: number) {
    return `trip:${tripId}`;
  }

  @SubscribeMessage('trip:join')
  async join(@ConnectedSocket() client: Socket, @MessageBody() dto: ChatRoomDto) {
    const userId: number = client.data.userId;
    await this.tripService.ensureTripAccess(dto.tripId, userId);
    await client.join(this.room(dto.tripId));
    return { tripId: dto.tripId };
  }

  @SubscribeMessage('message:send')
  async send(@ConnectedSocket() client: Socket, @MessageBody() dto: SendMessageDto) {
    const userId: number = client.data.userId;
    const message = await this.chatService.create(userId, dto.tripId, { content: dto.content });

    const room = this.room(dto.tripId);
    this.server.to(room).emit('message:new', message);
  }

  @SubscribeMessage('message:delete')
  async remove(@ConnectedSocket() client: Socket, @MessageBody() dto: DeleteMessageDto) {
    const message = await this.chatService.remove(client.data.userId, dto.tripId, dto.id);
    this.server.to(this.room(dto.tripId)).emit('message:deleted', message);
  }
}