import { UserSummaryDto } from "../../user/dto/user-response.dto";
import { Message } from "../entities/chat.entity";

export class MessageResponseDto {
  id: number;
  tripId: number;
  content: string | null;
  deleted: boolean;
  createdAt: Date;
  sender: UserSummaryDto | null;

  constructor(m: Message) {
    this.id = m.id;
    this.tripId = m.tripId;
    this.deleted = !!m.deletedAt;
    this.content = this.deleted ? null : m.content;
    this.createdAt = m.createdAt;
    this.sender = m.sender ? new UserSummaryDto(m.sender) : null;
  }
}