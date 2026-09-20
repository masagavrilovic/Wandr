import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectTripsTotal } from '../../store/trips.selectors';
import { LoadTripsActions } from '../../store/trips.actions';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TripCardList } from '../../components/trip-card-list/trip-card-list';

@Component({
  imports: [AsyncPipe, TripCardList],
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit{
  private store = inject(Store);
  tripsCount$: Observable<number> = this.store.select(selectTripsTotal);

  ngOnInit(): void {
    this.store.dispatch(LoadTripsActions.loadTrips());
  }
}
