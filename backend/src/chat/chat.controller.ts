import { Controller, Get, Param, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':tripId')
  findAll(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number) {
    return this.chatService.findAll(req.user.id, tripId);
  }

  @Get(':tripId/:id')
  findOne(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number) {
    return this.chatService.findOne(req.user.id, tripId, id);
  }
}
