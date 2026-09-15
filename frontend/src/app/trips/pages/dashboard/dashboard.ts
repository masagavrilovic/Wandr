import { Component, inject, OnInit, signal } from '@angular/core';
import { TripCardList } from '../../components/trip-card-list/trip-card-list';
import { Store } from '@ngrx/store';
import { selectTripsTotal } from '../../store/trips.selectors';
import { loadTrips } from '../../store/trips.actions';
import { AsyncPipe } from '@angular/common';
import { Topbar } from '../../../shared/components/topbar/topbar';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripsService } from '../../trips.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TripCardList, AsyncPipe, Topbar, RouterLink, ReactiveFormsModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private store = inject(Store);
  tripsCount$ = this.store.select(selectTripsTotal);
  private tripsService = inject(TripsService);

  isJoinModalOpen = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');
  joinForm = new FormGroup({
  inviteCode: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]),
  });
  
  ngOnInit() {
      this.store.dispatch(loadTrips());
  }

  openJoinModal() {
    this.isJoinModalOpen.set(true);
  }

  closeJoinModal() {
    this.isSubmitting.set(false);
    this.errorMessage.set('');
    this.joinForm.reset();
    this.isJoinModalOpen.set(false);
  }

  onSubmit() {
    if (this.joinForm.invalid) {
      this.joinForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    const code = this.joinForm.value.inviteCode;

    this.tripsService.joinTrip(code!).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('');
        this.joinForm.reset();
        this.closeJoinModal();
        this.store.dispatch(loadTrips());
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        if (err.status === 404) this.errorMessage.set('Invalid invite code');
        else this.errorMessage.set('Something went wrong. Please try again.');
      }
    })

  }
}
