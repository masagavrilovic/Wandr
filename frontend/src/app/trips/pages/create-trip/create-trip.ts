import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { TripsService } from '../../trips.service';
import { Topbar } from '../../../shared/components/topbar/topbar';

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Topbar],
  templateUrl: './create-trip.html',
})
export class CreateTripComponent {
  private fb = inject(FormBuilder);
  private tripsService = inject(TripsService);
  private router = inject(Router);

  name = signal<string | null>('UNKNOWN');
  startDate = signal<string | null>('-');
  endDate = signal<string | null>('-');
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  imagePreview = signal<string | null>(null);
  selectedFile: File | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  constructor() {
    this.form.get('name')?.valueChanges.subscribe(value => {
      this.name.set(value);
    });
    this.form.get('startDate')?.valueChanges.subscribe(value => {
      this.startDate.set(value);
    });
    this.form.get('endDate')?.valueChanges.subscribe(value => {
      this.endDate.set(value);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      this.errorMessage.set('Allowed formats: JPG, PNG, WEBP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('Maximum picture size is 5MB');
      return;
    }

    this.errorMessage.set(null);
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, startDate, endDate } = this.form.getRawValue();
    if (new Date(startDate!) > new Date(endDate!)) {
      this.errorMessage.set('Start date must be before end date');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.tripsService
      .createTrip({ name: name!, startDate: startDate!, endDate: endDate! })
      .pipe(
        switchMap((trip) => {
          if (this.selectedFile) {
            return this.tripsService.uploadTripImage(trip.id, this.selectedFile);
          }
          return of(trip);
        }),
        catchError((err) => {
          this.errorMessage.set(err?.error?.message || 'Error while creating trip');
          this.isSubmitting.set(false);
          return of(null);
        })
      )
      .subscribe((trip) => {
        if (trip) {
          this.router.navigate(['/dashboard']);
        }
      });
  }
}