import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':tripId')
  create(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Body() createMessageDto: CreateMessageDto) {
    return this.chatService.create(req.user.id, tripId, createMessageDto);
  }

  @Get(':tripId')
  findAll(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number) {
    return this.chatService.findAll(req.user.id, tripId);
  }

  @Get(':tripId/:id')
  findOne(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number) {
    return this.chatService.findOne(req.user.id, tripId, id);
  }

  @Delete(':tripId/:id')
  remove(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number) {
    return this.chatService.remove(req.user.id, tripId, id);
  }
}
