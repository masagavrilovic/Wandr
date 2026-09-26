import { Component, inject, Input } from '@angular/core';
import { Trip } from '../../trips.models';
import { DateRangePipe, ImageUrlPipe, TripBadgeColorPipe } from '../../trips.pipes';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  imports: [TripBadgeColorPipe, DateRangePipe, ImageUrlPipe, NgClass],
  standalone: true,
  selector: 'app-trip-card',
  templateUrl: './trip-card.html',
})
export class TripCard {
  @Input({ required: true }) trip!: Trip;
  private router = inject(Router);

  navigateToTrip() {
    this.router.navigate(['/trips', this.trip.id]);
  }
}
