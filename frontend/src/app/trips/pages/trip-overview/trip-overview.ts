import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectSelectedTrip, selectTripDetailPending, selectTripLoadingByIdError, selectTripUpdating, selectUpdateTripError } from '../../store/trips.selectors';
import { UpdateTripActions } from '../../store/trips.actions';
import { AsyncPipe } from '@angular/common';
import { Topbar } from '../../../shared/topbar/topbar';
import { DateRangePipe, ImageUrlPipe } from '../../trips.pipes';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Trip, TripStatus } from '../../trips.models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [
    AsyncPipe, 
    RouterOutlet, 
    Topbar, 
    ImageUrlPipe, 
    DateRangePipe, 
    RouterLinkActive, 
    RouterLink, 
    ReactiveFormsModule,
  ],
  standalone: true,
  selector: 'app-trip-overview',
  templateUrl: './trip-overview.html',
})
export class TripOverview{
  private store = inject(Store);
  private actions$ = inject(Actions);

  constructor() {
    this.actions$
      .pipe(ofType(UpdateTripActions.updateTripSuccess), takeUntilDestroyed())
      .subscribe(() => {
        this.closeEditModal();
      });
  }

  readonly trip$ = this.store.select(selectSelectedTrip);

  isLoading$ = this.store.select(selectTripDetailPending);
  loadError$ = this.store.select(selectTripLoadingByIdError);

  protected showEditModal = signal(false);
  isUpdating$ = this.store.select(selectTripUpdating);
  updateError$ = this.store.select(selectUpdateTripError);

  private fb = inject(FormBuilder);
  protected imagePreview = signal<string | null>(null);
  protected selectedImage = signal<File | null>(null);
  protected removeImage = signal(false);
  status = Object.values(TripStatus);

  tripForm = this.fb.group({
    destination: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: [TripStatus.PLANNING, Validators.required],
  });


  openEditModal(trip: Trip): void {
     this.tripForm.setValue({
      destination: trip.destination,
      startDate: this.toDateInputValue(trip.startDate),
      endDate: this.toDateInputValue(trip.endDate),
      status: trip.status,
    });
    this.imagePreview.set(trip.imagePath ?? null);
    this.selectedImage.set(null);
    this.removeImage.set(false);
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.store.dispatch(UpdateTripActions.clearUpdateError());
    this.showEditModal.set(false);
    this.selectedImage.set(null);
    this.imagePreview.set(null);
    this.removeImage.set(false);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedImage.set(file);
    this.removeImage.set(false);

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  onRemoveImage(): void {
    this.selectedImage.set(null);
    this.imagePreview.set(null);
    this.removeImage.set(true);
  }

  private toDateInputValue(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(tripId: number): void {
    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      return;
    }

    const { destination, startDate, endDate, status } = this.tripForm.getRawValue();
    if (new Date(startDate!) > new Date(endDate!)) {
      this.tripForm.get('endDate')?.setErrors({ dateOrder: true });
      return;
    }

    this.store.dispatch(UpdateTripActions.updateTrip({
      id: tripId,
      payload: {
        destination: destination!,
        startDate: startDate!,
        endDate: endDate!,
        status: status!,
        removeImage: this.removeImage(),
      },
      image: this.selectedImage() ?? undefined,
    }));
  }
}
