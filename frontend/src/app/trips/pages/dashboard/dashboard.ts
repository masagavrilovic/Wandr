import { Component, inject, OnInit } from '@angular/core';
import { TripCardList } from '../../components/trip-card-list/trip-card-list';
import { Store } from '@ngrx/store';
import { selectTripsTotal } from '../../store/trips.selectors';
import { loadTrips } from '../../store/trips.actions';
import { AsyncPipe } from '@angular/common';
import { Topbar } from '../../../shared/components/topbar/topbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TripCardList, AsyncPipe, Topbar, RouterLink],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private store = inject(Store);
  tripsCount$ = this.store.select(selectTripsTotal);

  ngOnInit() {
      this.store.dispatch(loadTrips());
  }
}
