import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EMPTY, Observable, catchError, distinctUntilChanged, filter, map, merge, of, scan, startWith, switchMap, take } from 'rxjs';
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

  readonly messages$: Observable<ChatMessage[]> = this.tripId$.pipe(
    switchMap((tripId) => {
      this.error.set(null);

      const history$ = this.chatSocket.connect().pipe(
        switchMap(() => this.chatSocket.joinTrip(tripId)),
        switchMap(() => this.api.getMessages(tripId)),
        catchError(() => {
          this.error.set('Could not join the chat');
          return EMPTY;
        }),
      );

      const newMessage$ = this.chatSocket.on<ChatMessage>('message:new').pipe(
        map(msg => (currentList: ChatMessage[]) => [...currentList, msg])
      );

      const deletedMessage$ = this.chatSocket.on<{ id: number }>('message:deleted').pipe(
        map(deleted => (currentList: ChatMessage[]) =>
          currentList.map(m =>
            m.id === deleted.id ? { ...m, deleted: true } : m
          )
        )
      );

      return history$.pipe(
        switchMap(initialHistory => 
          merge(
            of(initialHistory),
            newMessage$,
            deletedMessage$
          ).pipe(
            scan((accList, updateFn) => {
              if (Array.isArray(updateFn)) {
                return updateFn;
              }
              return updateFn(accList);
            }, [] as ChatMessage[])
          )
        ),
        startWith([])
      );
    })
  );

  draft = signal('');
  activeMenuId: number | null = null;

  showEmojiPicker = signal(false);

  toggleEmojiPicker() {
    this.showEmojiPicker.update(val => !val);
  }

  addEmoji(event: any) {
    this.draft.update(text => text + event.emoji.native);
  }

  ngOnInit(): void {
    this.chatSocket
      .on<{ message: string }>('exception')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => this.error.set(e.message));
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
}