import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentUserId } from '../../../auth/store/auth.selectors';
import { selectSelectedTrip, selectSelectedTripMembers, selectIsCurrentUserOwner, selectTripDeleting, selectDeleteTripError, selectTripLeaving, selectLeaveTripError } from '../../store/trips.selectors';
import { DeleteTripActions, LeaveTripActions } from '../../store/trips.actions';

@Component({
  imports: [AsyncPipe],
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private store = inject(Store);

  currentUserId$ = this.store.select(selectCurrentUserId);
  trip$ = this.store.select(selectSelectedTrip);
  members$ = this.store.select(selectSelectedTripMembers);
  isOwner$ = this.store.select(selectIsCurrentUserOwner);

  protected showDeleteModal = signal(false);
  isDeleting$ = this.store.select(selectTripDeleting);
  deleteError$ = this.store.select(selectDeleteTripError);

  protected showLeaveModal = signal(false);
  isLeaving$ = this.store.select(selectTripLeaving);
  leaveError$ = this.store.select(selectLeaveTripError);

  protected copied = signal(false);

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
