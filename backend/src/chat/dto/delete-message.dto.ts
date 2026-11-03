import { IsInt } from 'class-validator';

export class DeleteMessageDto {
  @IsInt()
  tripId: number;

  @IsInt()
  id: number;
}