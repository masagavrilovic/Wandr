import { Component, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActivitesLoading, selectActivitiesGroupedByDay, selectActivitiesLoadingError, selectDeleteErrors, selectDeletingIds } from '../store/activities.selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivityCard } from '../activity-card/activity-card';
import { DeleteActivityActions, LoadActivitiesActions } from '../store/activites.actions';

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

  deletingIds$ = this.store.select(selectDeletingIds);
  deleteErrors$ = this.store.select(selectDeleteErrors);

  ngOnInit(): void {
    this.store.dispatch(LoadActivitiesActions.loadActivities({ tripId: this.tripId }));
  }

  onDelete(activityId: number): void {
    this.store.dispatch(DeleteActivityActions.deleteActivity({ tripId: this.tripId, id: activityId }));
  }

  dismissDeleteError(id: number): void {
    this.store.dispatch(DeleteActivityActions.clearDeleteError({ id }));
  }
}
