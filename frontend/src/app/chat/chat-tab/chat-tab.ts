import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, EMPTY, Subject, catchError, distinctUntilChanged, exhaustMap, filter, merge, switchMap, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatService } from '../chat.service';
import { ChatMessage } from '../chat.models';
import { ChatSocketService } from '../chat-socket.service';
import { selectCurrentUserId } from '../../auth/store/auth.selectors';
import { selectDeleteTripError, selectLeaveTripError, selectSelectedTrip, selectSelectedTripId, selectSelectedTripMembers, selectTripDeleting, selectTripLeaving } from '../../trips/store/trips.selectors';
import { DeleteTripActions, LeaveTripActions } from '../../trips/store/trips.actions';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  imports: [DatePipe, FormsModule, AsyncPipe, PickerComponent],
  selector: 'app-chat-tab',
  templateUrl: './chat-tab.html',
})
export class ChatTab implements OnInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private api = inject(ChatService);
  private chatSocket = inject(ChatSocketService);

  currentUserId$ = this.store.select(selectCurrentUserId);
  members$ = this.store.select(selectSelectedTripMembers);
  trip$ = this.store.select(selectSelectedTrip);
  tripId$ = this.store.select(selectSelectedTripId).pipe(
    filter((id): id is number => id != null),
    distinctUntilChanged()
  );

  protected showDeleteModal = signal(false);
  isDeleting$ = this.store.select(selectTripDeleting);
  deleteError$ = this.store.select(selectDeleteTripError);

  protected showLeaveModal = signal(false);
  isLeaving$ = this.store.select(selectTripLeaving);
  leaveError$ = this.store.select(selectLeaveTripError);

  protected copied = signal(false);
  readonly error = signal<string | null>(null);

  private readonly list$ = new BehaviorSubject<ChatMessage[]>([]);
  readonly messages$ = this.list$.asObservable();

  private nextCursor: number | null = null;
  private readonly loadOlder$ = new Subject<void>();

  draft = signal('');
  activeMenuId: number | null = null;
  showEmojiPicker = signal(false);

  ngOnInit(): void {
    this.tripId$
      .pipe(
        tap(() => {
          this.nextCursor = null;
          this.list$.next([]);
          this.error.set(null);
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
              this.api.getMessages(tripId, this.nextCursor!).pipe(
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

  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    if (el.scrollHeight + el.scrollTop - el.clientHeight < 150) {
      this.loadOlder$.next();
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker.update(val => !val);
  }

  addEmoji(event: any) {
    this.draft.update(text => text + event.emoji.native);
  }

  toggleMessageMenu(messageId: number) {
    this.activeMenuId = this.activeMenuId === messageId ? null : messageId;
  }

  send() {
    const content = this.draft().trim();
    if (!content) return;

    this.tripId$.pipe(take(1)).subscribe((tripId) => {
      this.chatSocket.emit('message:send', { tripId, content });
    });
    this.draft.set('');
  }

  remove(id: number) {
    this.tripId$.pipe(take(1)).subscribe((tripId) => {
      this.chatSocket.emit('message:delete', { tripId, id });
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.store.dispatch(DeleteTripActions.clearDeleteError());
    this.showDeleteModal.set(false);
  }

  confirmDelete(tripId: number): void {
    this.store.dispatch(DeleteTripActions.deleteTrip({ id: tripId }));
  }

  openLeaveModal(): void {
    this.showLeaveModal.set(true);
  }

  closeLeaveModal(): void {
    this.store.dispatch(LeaveTripActions.clearLeaveError());
    this.showLeaveModal.set(false);
  }

  confirmLeave(tripId: number): void {
    this.store.dispatch(LeaveTripActions.leaveTrip({ id: tripId }));
  }

  copyInviteCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  isNewDay(currentMsgDate: string, prevMsgDate: string): boolean {
    if (!prevMsgDate) return true;
    return currentMsgDate.substring(0, 10) !== prevMsgDate.substring(0, 10);
  }
}