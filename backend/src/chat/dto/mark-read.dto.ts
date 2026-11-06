import { IsInt } from 'class-validator';

export class MarkReadDto {
  @IsInt()
  tripId: number;

  @IsInt()
  messageId: number;
}