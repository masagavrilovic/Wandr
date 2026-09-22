import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectDeleteTripError, selectTripById, selectTripDeleting, selectTripLoadingById, selectTripLoadingByIdError } from '../../store/trips.selectors';
import { DeleteTripActions, LoadTripByIdActions } from '../../store/trips.actions';
import { map, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Topbar } from '../../../shared/topbar/topbar';
import { DateRangePipe, ImageUrlPipe } from '../../trips.pipes';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [AsyncPipe, RouterOutlet, Topbar, ImageUrlPipe, DateRangePipe, RouterLinkActive, RouterLink],
  standalone: true,
  selector: 'app-trip-overview',
  templateUrl: './trip-overview.html',
})
export class TripOverview{
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private actions$ = inject(Actions);
  private router = inject(Router);

  constructor() {
    this.actions$
      .pipe(
        ofType(DeleteTripActions.deleteTripSuccess),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.showDeleteModal.set(false);
        this.router.navigate(['/dashboard']);
      });
  }

  readonly trip$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) =>
      this.store.select(selectTripById(id)).pipe(
        tap((trip) => {
          if (!trip) {
            this.store.dispatch(LoadTripByIdActions.loadTripById({ id }));
          }
        })
      )
    )
  );
  isLoading$ = this.store.select(selectTripLoadingById);
  loadError$ = this.store.select(selectTripLoadingByIdError);
  protected copied = signal(false);

  protected showDeleteModal = signal(false);
  isDeleting$ = this.store.select(selectTripDeleting);
  deleteError$ = this.store.select(selectDeleteTripError);

  copyInviteCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
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
}
