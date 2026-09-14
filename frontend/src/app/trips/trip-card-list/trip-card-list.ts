import { Component, inject, OnInit, signal } from '@angular/core';
import { TripsState } from '../store/trips.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectActiveTripsWithoutHero, selectArchivedTrips, selectHeroTrip, selectTripsError, selectTripsLoading } from '../store/trips.selectors';
import { Trip } from '../trips.models';
import { loadTrips } from '../store/trips.actions';
import { AsyncPipe } from '@angular/common';
import { TripCard } from '../trip-card/trip-card';
import { TripHeroCard } from '../trip-hero-card/trip-hero-card';

@Component({
  selector: 'app-trip-card-list',
  standalone: true,
  imports: [AsyncPipe, TripCard, TripHeroCard],
  templateUrl: './trip-card-list.html',
})
export class TripCardList implements OnInit {
  private readonly store: Store<{ trips: TripsState }> = inject(Store);
  heroTrip$: Observable<Trip | null> = this.store.select(selectHeroTrip);
  activeTrips$: Observable<Trip[]> = this.store.select(selectActiveTripsWithoutHero);
  archivedTrips$: Observable<Trip[]> = this.store.select(selectArchivedTrips);
  isLoading$: Observable<boolean> = this.store.select(selectTripsLoading);
  error$: Observable<string | null> = this.store.select(selectTripsError);

  showArchivedTrips = signal(false);

  ngOnInit(): void {
    this.store.dispatch(loadTrips());
  }

  toggleArchive(): void {
    this.showArchivedTrips.update(value => !value);
  }
}
