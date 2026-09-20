import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectTripCreating, selectTripCreatingError } from '../../store/trips.selectors';
import { map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CreateTripActions } from '../../store/trips.actions';

@Component({
  imports: [AsyncPipe, RouterLink, ReactiveFormsModule],
  standalone: true,
  selector: 'app-create-trip',
  templateUrl: './create-trip.html',
})
export class CreateTrip {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  form = this.fb.group({
    destination: ['', [Validators.required]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  isCreating$ = this.store.select(selectTripCreating);
  creatingError$ = this.store.select(selectTripCreatingError);

  destination$ = this.form.controls.destination.valueChanges.pipe(
    startWith(this.form.controls.destination.value),
    map((v) => v || 'UNKNOWN')
  );
  startDate$ = this.form.controls.startDate.valueChanges.pipe(
    startWith(this.form.controls.startDate.value),
    map((v) => v || '-')
  );
  endDate$ = this.form.controls.endDate.valueChanges.pipe(
    startWith(this.form.controls.endDate.value),
    map((v) => v || '-')
  );

  localError = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      this.localError.set('Allowed formats: JPG, PNG, WEBP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.localError.set('Maximum picture size is 5MB');
      return;
    }

    this.localError.set(null);
    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

   removeImage(): void {
    this.selectedFile.set(null);
    this.imagePreview.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { destination, startDate, endDate } = this.form.getRawValue();
    if (new Date(startDate!) > new Date(endDate!)) {
      this.localError.set('Start date must be before end date');
      return;
    }
    this.localError.set(null);
    this.store.dispatch(CreateTripActions.createTrip({
      payload: { destination: destination!, startDate: startDate!, endDate: endDate!},
      image: this.selectedFile() ?? undefined
    }));
  }

}
