import { UserSummaryDto } from '../../user/dto/user-response.dto';
import { ReadState } from '../entities/read-state.entity';

export class ReadStateResponseDto {
  userId: number;
  lastReadMessageId: number;
  user: UserSummaryDto;

  constructor(s: ReadState) {
    this.userId = s.userId;
    this.lastReadMessageId = s.lastReadMessageId;
    this.user = new UserSummaryDto(s.user);
  }
}