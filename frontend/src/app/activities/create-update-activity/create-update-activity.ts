import { Component, EventEmitter, inject, Input, numberAttribute, OnInit, Output } from '@angular/core';
import { Activity, ActivityCategory, CreateActivityPayload, UpdateActivityPayload } from '../activities.models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { selectCreateActivityError, selectCreatingActivity, selectUpdateActivityError, selectUpdatingActivity } from '../store/activities.selectors';
import { LocationResult } from '../../photon/photon.models';
import { Observable } from 'rxjs';
import { CreateActivityActions, UpdateActivityActions } from '../store/activities.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { LocationSearch } from '../../photon/location-search/location-search';

@Component({
  imports: [AsyncPipe, ReactiveFormsModule, LocationSearch],
  selector: 'app-create-update-activity',
  templateUrl: './create-update-activity.html',
})
export class CreateUpdateActivity implements OnInit {
  @Input({ transform: numberAttribute }) tripId!: number;
  @Input() activity: Activity | null = null;
  @Output() closed = new EventEmitter();

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);

  isEditMode = false;

  isSaving$!: Observable<boolean>;
  error$!: Observable<string | null>;

  categories = Object.values(ActivityCategory);

  activityForm = this.fb.group({
    title: ['', [Validators.required]],
    date: [null as string | null],
    time: [null as string | null],
    location: [null as LocationResult | null],
    category: [null as ActivityCategory | null],
    notes: [null as string | null]
  });

  constructor() {
    this.actions$
      .pipe(
        ofType(CreateActivityActions.createActivitySuccess, UpdateActivityActions.updateActivitySuccess),
        takeUntilDestroyed()
      )
      .subscribe(() => this.close());
  }

  ngOnInit(): void {
    this.isEditMode = !!this.activity;

    if (this.isEditMode) {
      this.isSaving$ = this.store.select(selectUpdatingActivity);
      this.error$ = this.store.select(selectUpdateActivityError);
      this.store.dispatch(UpdateActivityActions.clearUpdateError());
      this.patchFormFromActivity(this.activity!);
    } else {
      this.isSaving$ = this.store.select(selectCreatingActivity);
      this.error$ = this.store.select(selectCreateActivityError);
      this.store.dispatch(CreateActivityActions.clearCreateError());
    }
  }

  private patchFormFromActivity(activity: Activity): void {
    this.activityForm.patchValue({
      title: activity.name,
      date: activity.date ?? null,
      time: activity.time ?? null,
      category: activity.category,
      notes: activity.notes ?? null,
      location: activity.address
        ? {
            displayName: activity.address,
            latitude: activity.latitude,
            longitude: activity.longitude,
          } as LocationResult
        : null,
    });
  }

  onSubmit() {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    const { title, date, time, location, category, notes } = this.activityForm.getRawValue();

    if (this.isEditMode) {
      const payload: UpdateActivityPayload = {
        name: title!,
        date: date || null,
        time: time || null,
        address: location?.displayName ?? null,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
        category: category ?? undefined,
        notes: notes?.trim() || null,
      };

      this.store.dispatch(UpdateActivityActions.updateActivity({
        tripId: this.tripId,
        id: this.activity!.id,
        payload,
      }));
    } else {
      const payload: CreateActivityPayload = {
        name: title!,
        date: date || null,
        time: time || null,
        address: location?.displayName ?? null,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
        category: category ?? undefined,
        notes: notes?.trim() || null,
      };

      this.store.dispatch(CreateActivityActions.createActivity({ tripId: this.tripId, payload }));
    }
  }

  close(isSaving?: boolean | null) {
    if (!isSaving) this.closed.emit();
  }

}
