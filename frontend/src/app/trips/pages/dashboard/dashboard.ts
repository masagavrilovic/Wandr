import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TripCardList } from '../../components/trip-card-list/trip-card-list';
import { JoinTripActions, LoadTripsActions } from '../../store/trips.actions';
import { selectTripJoining, selectTripJoiningError, selectTripsTotal } from '../../store/trips.selectors';
import { Topbar } from '../../../shared/topbar/topbar';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, TripCardList, RouterLink, ReactiveFormsModule, Topbar],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  readonly tripsCount$: Observable<number> = this.store.select(selectTripsTotal);
  readonly isJoining$: Observable<boolean> = this.store.select(selectTripJoining);
  readonly joiningError$: Observable<string | null> = this.store.select(selectTripJoiningError);

  readonly isJoinModalOpen = signal(false);

  readonly joinForm = new FormGroup({
    inviteCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(7), Validators.maxLength(7)],
    }),
  });
  readonly inviteCode = this.joinForm.controls.inviteCode;

  constructor() {
    this.actions$
      .pipe(ofType(JoinTripActions.joinTripSuccess), takeUntilDestroyed())
      .subscribe(() => this.closeJoinModal());
  }

  ngOnInit(): void {
    this.store.dispatch(LoadTripsActions.loadTrips());
  }

  openJoinModal(): void {
    this.isJoinModalOpen.set(true);
  }

  closeJoinModal(): void {
    this.store.dispatch(JoinTripActions.resetJoinError());
    this.joinForm.reset();
    this.isJoinModalOpen.set(false);
  }

  onSubmit(): void {
    if (this.joinForm.invalid) {
      this.joinForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(JoinTripActions.joinTrip({ inviteCode: this.joinForm.getRawValue().inviteCode }));
  }
}