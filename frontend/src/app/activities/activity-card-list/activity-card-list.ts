import { Component, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActivitesLoading, selectActivitiesGroupedByDay, selectActivitiesLoadingError } from '../store/activities.selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivityCard } from '../activity-card/activity-card';
import { LoadActivitiesActions } from '../store/activites.actions';

@Component({
  imports: [AsyncPipe, ActivityCard, DatePipe],
  standalone: true,
  selector: 'app-activity-card-list',
  templateUrl: './activity-card-list.html',
})
export class ActivityCardList implements OnInit{
  @Input({ required: true }) tripId!: number;
  private readonly store = inject(Store);
  isLoading$ = this.store.select(selectActivitesLoading);
  error$  = this.store.select(selectActivitiesLoadingError);
  groupedActivities$ = this.store.select(selectActivitiesGroupedByDay);

  ngOnInit(): void {
    console.log(this.tripId)
    this.store.dispatch(LoadActivitiesActions.loadActivities({ tripId: this.tripId }));
  }
}
