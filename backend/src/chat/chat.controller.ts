import { Controller, Get, Param, UseGuards, ParseIntPipe, Req, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CursorPaginationQueryDto } from '../common/dto/cursor-pagination.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':tripId/read')
  getReadStates(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number) {
    return this.chatService.getReadStates(req.user.id, tripId);
  }

  @Get(':tripId')
  findAll(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Query() query: CursorPaginationQueryDto) {
    return this.chatService.findAll(req.user.id, tripId, query);
  }

  @Get(':tripId/:id')
  findOne(@Req() req: any, @Param('tripId', ParseIntPipe) tripId: number, @Param('id', ParseIntPipe) id: number) {
    return this.chatService.findOne(req.user.id, tripId, id);
  }
}
