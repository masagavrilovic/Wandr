import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActivitiesGroupedByDay, selectActivitiesLoadingError, selectDeleteErrors, selectActivitiesInitialLoading } from '../store/activities.selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivityCard } from '../activity-card/activity-card';
import { DeleteActivityActions } from '../store/activities.actions';

@Component({
  imports: [AsyncPipe, ActivityCard, DatePipe],
  standalone: true,
  selector: 'app-activity-card-list',
  templateUrl: './activity-card-list.html',
})
export class ActivityCardList {
  private readonly store = inject(Store);

  isLoading$ = this.store.select(selectActivitiesInitialLoading);
  error$  = this.store.select(selectActivitiesLoadingError);
  groupedActivities$ = this.store.select(selectActivitiesGroupedByDay);
  deleteErrors$ = this.store.select(selectDeleteErrors);

  onDelete(activityId: number): void {
    this.store.dispatch(DeleteActivityActions.deleteActivity({ id: activityId }));
  }

  dismissDeleteError(id: number): void {
    this.store.dispatch(DeleteActivityActions.clearDeleteError({ id }));
  }
}
