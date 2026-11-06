import { ReadState } from "../entities/read-state.entity";

export class ReadStateResponseDto {
  userId: number;
  lastReadMessageId: number;

  constructor(s: ReadState) {
    this.userId = s.userId;
    this.lastReadMessageId = s.lastReadMessageId;
  }
}