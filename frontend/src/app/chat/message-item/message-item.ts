import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ChatMessage } from '../chat.models';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-message-item',
  templateUrl: './message-item.html',
})
export class MessageItem {
  @Input({ required: true }) message!: ChatMessage;
  @Input() mine = false;
  @Input() sameSender = false;

  @Output() edit = new EventEmitter<ChatMessage>();
  @Output() remove = new EventEmitter<number>();

  protected menuOpen = signal(false);

  get initials(): string {
    const s = this.message.sender;
    return s ? s.firstName[0] + s.lastName[0] : '?';
  }

  get senderName(): string {
    const s = this.message.sender;
    return s ? `${s.firstName} ${s.lastName}` : 'Deleted user';
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  onEdit(): void {
    this.menuOpen.set(false);
    this.edit.emit(this.message);
  }

  onRemove(): void {
    this.menuOpen.set(false);
    this.remove.emit(this.message.id);
  }
}
