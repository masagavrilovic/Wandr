import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, EMPTY, Subject, catchError, distinctUntilChanged, exhaustMap, filter, merge, switchMap, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ChatService } from '../chat.service';
import { ChatMessage } from '../chat.models';
import { ChatSocketService } from '../chat-socket.service';
import { selectCurrentUserId } from '../../auth/store/auth.selectors';
import { selectSelectedTripId } from '../../trips/store/trips.selectors';
import { MessageList } from '../message-list/message-list';
import { Sidebar } from '../../trips/components/sidebar/sidebar';

@Component({
  imports: [AsyncPipe, FormsModule, PickerComponent, Sidebar, MessageList],
  selector: 'app-chat-tab',
  templateUrl: './chat-tab.html',
})
export class ChatTab implements OnInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private api = inject(ChatService);
  private chatSocket = inject(ChatSocketService);

  currentUserId$ = this.store.select(selectCurrentUserId);
  tripId$ = this.store.select(selectSelectedTripId).pipe(
    filter((id): id is number => id != null),
    distinctUntilChanged()
  );

  readonly error = signal<string | null>(null);

  private readonly list$ = new BehaviorSubject<ChatMessage[]>([]);
  readonly messages$ = this.list$.asObservable();

  private nextCursor: number | null = null;
  private readonly loadOlder$ = new Subject<void>();

  draft = signal('');
  showEmojiPicker = signal(false);
  editing: ChatMessage | null = null;

  ngOnInit(): void {
    this.tripId$
      .pipe(
        tap(() => {
          this.nextCursor = null;
          this.list$.next([]);
          this.error.set(null);
          this.cancelEdit();
        }),
        switchMap((tripId) =>
          this.chatSocket.connect().pipe(
            switchMap(() => this.chatSocket.joinTrip(tripId)),
            switchMap(() => this.api.getMessages(tripId)),
            catchError(() => {
              this.error.set('Could not join the chat');
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((page) => {
        this.list$.next(page.data);
        this.nextCursor = page.nextCursor;
      });

    this.tripId$
      .pipe(
        switchMap((tripId) =>
          this.loadOlder$.pipe(
            filter(() => this.nextCursor != null),
            exhaustMap(() =>
              this.api.getMessages(tripId, 10, this.nextCursor!).pipe(
                catchError(() => {
                  this.error.set('Could not load older messages');
                  return EMPTY;
                }),
              ),
            ),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((page) => {
        this.nextCursor = page.nextCursor;
        this.update((list) => [...page.data, ...list]);
      });

    this.chatSocket
      .on<ChatMessage>('message:new')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((msg) => this.update((list) => [...list, msg]));

    merge(
      this.chatSocket.on<ChatMessage>('message:deleted'),
      this.chatSocket.on<ChatMessage>('message:updated'),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((msg) =>
        this.update((list) => list.map((m) => (m.id === msg.id ? msg : m))),
      );

    this.chatSocket
      .on<{ message: string }>('exception')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => this.error.set(e.message));
  }

  private update(fn: (list: ChatMessage[]) => ChatMessage[]) {
    this.list$.next(fn(this.list$.value));
  }

  loadOlder(): void {
    this.loadOlder$.next();
  }

  send() {
    const content = this.draft().trim();
    if (!content) return;

    const editing = this.editing;

    if (!editing) {
      this.tripId$.pipe(take(1)).subscribe((tripId) => {
        this.chatSocket.emit('message:send', { tripId, content });
      });
    } 
    else if (editing.content !== content) {
      this.tripId$.pipe(take(1)).subscribe((tripId) => {
        this.chatSocket.emit('message:update', { tripId, id: editing.id, content });
      });
    }

    this.cancelEdit();
  }

  remove(id: number) {
    this.tripId$.pipe(take(1)).subscribe((tripId) => {
      this.chatSocket.emit('message:delete', { tripId, id });
    });
  }

  startEdit(msg: ChatMessage) {
    this.editing = msg;
    this.draft.set(msg.content ?? '');
  }

  cancelEdit() {
    this.editing = null;
    this.draft.set('');
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker.update((v) => !v);
  }

  addEmoji(event: { emoji: { native?: string } }): void {
    this.draft.update((text) => text + (event.emoji.native ?? ''));
  }
}