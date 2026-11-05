import { IsInt } from "class-validator";
import { CreateMessageDto } from "./create-message.dto";

export class UpdateMessageDto extends CreateMessageDto {
  @IsInt()
  tripId: number;

  @IsInt()
  id: number;
}