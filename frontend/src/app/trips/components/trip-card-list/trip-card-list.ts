import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Trip } from '../../trips.models';
import { selectActiveTripsWithoutHero, selectArchivedTrips, selectHeroTrip, selectTripsError, selectTripsLoading, selectTripsTotal } from '../../store/trips.selectors';
import { TripCard } from '../trip-card/trip-card';
import { AsyncPipe } from '@angular/common';
import { HeroTripCard } from '../hero-trip-card/hero-trip-card';

@Component({
  imports: [TripCard, HeroTripCard, AsyncPipe],
  selector: 'app-trip-card-list',
  templateUrl: './trip-card-list.html',
})
export class TripCardList {
  private readonly store = inject(Store);
  heroTrip$: Observable<Trip | null> = this.store.select(selectHeroTrip);
  activeTrips$: Observable<Trip[]> = this.store.select(selectActiveTripsWithoutHero);
  archivedTrips$: Observable<Trip[]> = this.store.select(selectArchivedTrips);
  isLoading$: Observable<boolean> = this.store.select(selectTripsLoading);
  error$: Observable<string | null> = this.store.select(selectTripsError);
  
  showArchivedTrips = signal(false);

  toggleArchive(): void {
    this.showArchivedTrips.update(value => !value);
  }
}
