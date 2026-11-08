import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChatMessage } from '../chat.models';
import { MessageItem } from '../message-item/message-item';

@Component({
  selector: 'app-message-list',
  imports: [DatePipe, MessageItem],
  templateUrl: './message-list.html',
})
export class MessageList {
  @Input() messages: ChatMessage[] = [];
  @Input() currentUserId: number | null = null;

  @Output() loadOlder = new EventEmitter<void>();
  @Output() edit = new EventEmitter<ChatMessage>();
  @Output() remove = new EventEmitter<number>();

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    if (el.scrollHeight + el.scrollTop - el.clientHeight < 150) {
      this.loadOlder.emit();
    }
  }

  isNewDay(currentMsgDate: string, prevMsgDate: string | null | undefined): boolean {
    if (!prevMsgDate) return true;
    return currentMsgDate.substring(0, 10) !== prevMsgDate.substring(0, 10);
  }
}