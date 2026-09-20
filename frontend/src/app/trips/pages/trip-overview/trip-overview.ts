import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectTripById, selectTripLoadingById, selectTripLoadingByIdError } from '../../store/trips.selectors';
import { LoadTripByIdActions } from '../../store/trips.actions';
import { map, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Topbar } from '../../../shared/topbar/topbar';
import { DateRangePipe, ImageUrlPipe } from '../../trips.pipes';

@Component({
  imports: [AsyncPipe, RouterOutlet, Topbar, ImageUrlPipe, DateRangePipe],
  standalone: true,
  selector: 'app-trip-overview',
  templateUrl: './trip-overview.html',
})
export class TripOverview{
  private route = inject(ActivatedRoute);
  private store = inject(Store);

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

    copyInviteCode(code: string) : void {
    navigator.clipboard.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
