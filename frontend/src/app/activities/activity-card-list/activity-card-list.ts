import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActivitiesGroupedByDay, selectActivitiesLoadingError, selectDeleteErrors, selectActivitiesInitialLoading, selectShowActivityFilter, selectActivitiesMoreLoading, selectActivitiesMoreError, selectActivitiesDateFilter, selectCanLoadMoreActivities } from '../store/activities.selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivityCard } from '../activity-card/activity-card';
import { ActivityFilterActions, DeleteActivityActions, LoadActivitiesActions } from '../store/activities.actions';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [AsyncPipe, ActivityCard, DatePipe, ReactiveFormsModule],
  standalone: true,
  selector: 'app-activity-card-list',
  templateUrl: './activity-card-list.html',
})
export class ActivityCardList implements OnInit {
  private readonly store = inject(Store);
  private destroyRef = inject(DestroyRef);

  dateControl = new FormControl<string>('', { nonNullable: true });

  isLoading$ = this.store.select(selectActivitiesInitialLoading);
  error$  = this.store.select(selectActivitiesLoadingError);
  groupedActivities$ = this.store.select(selectActivitiesGroupedByDay);
  deleteErrors$ = this.store.select(selectDeleteErrors);
  showFilter$ = this.store.select(selectShowActivityFilter);
  moreLoading$ = this.store.select(selectActivitiesMoreLoading);
  moreError$ = this.store.select(selectActivitiesMoreError);

  ngOnInit(): void {
    this.store.select(selectActivitiesDateFilter)
    .pipe(take(1))
    .subscribe((date) => this.dateControl.setValue(date ?? '', { emitEvent: false }));

    this.dateControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) =>
      this.store.dispatch(ActivityFilterActions.setDate({ date: value }))
    );
  }
  onDelete(activityId: number): void {
    this.store.dispatch(DeleteActivityActions.deleteActivity({ id: activityId }));
  }

  dismissDeleteError(id: number): void {
    this.store.dispatch(DeleteActivityActions.clearDeleteError({ id }));
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (!atBottom) return;

    this.store.select(selectCanLoadMoreActivities)
    .pipe(take(1))
    .subscribe((canLoadMore) => {
      if (canLoadMore) this.store.dispatch(LoadActivitiesActions.loadMoreActivities());
    });
  }
}
