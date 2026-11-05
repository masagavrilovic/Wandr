import { UserSummary } from "../user/user.models";

export interface ChatMessage {
  id: number;
  tripId: number;
  content: string | null;
  deleted: boolean;
  edited: boolean;
  createdAt: string;
  sender: UserSummary | null;
}