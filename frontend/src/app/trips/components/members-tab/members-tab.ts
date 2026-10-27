import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDeleteTripError, selectSelectedTrip, selectSelectedTripMembers, selectTripDeleting } from '../../store/trips.selectors';
import { AsyncPipe } from '@angular/common';
import { selectCurrentUserId } from '../../../auth/store/auth.selectors';
import { DeleteTripActions } from '../../store/trips.actions';

@Component({
  imports: [AsyncPipe],
  selector: 'app-members-tab',
  templateUrl: './members-tab.html',
})
export class MembersTab {
  private store = inject(Store);
  trip$ = this.store.select(selectSelectedTrip);
  members$ = this.store.select(selectSelectedTripMembers);
  userId$ = this.store.select(selectCurrentUserId);

  protected showDeleteModal = signal(false);
  isDeleting$ = this.store.select(selectTripDeleting);
  deleteError$ = this.store.select(selectDeleteTripError);

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

  copyInviteCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
