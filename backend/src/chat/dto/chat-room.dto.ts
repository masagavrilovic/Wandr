import { IsInt } from 'class-validator';

export class ChatRoomDto {
  @IsInt()
  tripId: number;
}