import { Component, Input } from '@angular/core';
import { Trip, TripStatus } from '../trips.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-card',
  imports: [CommonModule],
  templateUrl: './trip-card.html',
})
export class TripCard {
  @Input({ required: true }) trip!: Trip;

  get formattedDateRange(): string {
    const start = new Date(this.trip.startDate);
    const end = new Date(this.trip.endDate);
    
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`;
  }

  getBadgeColor(status: TripStatus): string {
    switch (status) {
      case TripStatus.PLANNING:
        return 'bg-primary';
      case TripStatus.ONGOING:
        return 'bg-secondary-dark';
      case TripStatus.FINISHED:
        return 'bg-tertiary';
      case TripStatus.CANCELED:
        return 'bg-accent';
      default:
        return 'bg-primary';
    }
  }
}
