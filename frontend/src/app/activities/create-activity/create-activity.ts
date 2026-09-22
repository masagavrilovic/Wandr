import { Component, EventEmitter, inject, Input, numberAttribute, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LocationResult } from '../../photon/photon.models';
import { LocationSearch } from '../../photon/location-search/location-search';
import { ActivityCategory, CreateActivityPayload } from '../activities.models';
import { CreateActivityActions } from '../store/activities.actions';
import { selectCreateActivityError, selectCreatingActivity } from '../store/activities.selectors';
import { AsyncPipe } from '@angular/common';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [ReactiveFormsModule, LocationSearch, AsyncPipe],
  standalone: true,
  selector: 'app-create-activity',
  templateUrl: './create-activity.html',
})
export class CreateActivity {
  @Input({ transform: numberAttribute }) tripId!: number;
  @Output() closed = new EventEmitter();

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);

  isCreating$ = this.store.select(selectCreatingActivity);
  createError$ = this.store.select(selectCreateActivityError);

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
    this.store.dispatch(CreateActivityActions.clearCreateError());
    this.actions$
      .pipe(
        ofType(CreateActivityActions.createActivitySuccess),
        takeUntilDestroyed()
      )
      .subscribe(() => this.close());
  }

  onSubmit() {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    const { title, date, time, location, category, notes } = this.activityForm.getRawValue();

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

    this.store.dispatch(CreateActivityActions.createActivity({ tripId: this.tripId, payload: payload }));

  }

  close(isCreating?: boolean | null) {
    if (!isCreating) this.closed.emit();
  }
}
