import { Component, Input, OnChanges } from '@angular/core';
import { Trip, TripStatus } from '../../trips.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-hero-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-hero-card.html'
})
export class TripHeroCard implements OnChanges {
  @Input({ required: true }) trip!: Trip;

  isOngoing = false;
  daysUntil = 0;
  daysLeft = 0;
  formattedDateRange = '';

  ngOnChanges(): void {
    if (!this.trip) return;

    const now = new Date();
    const start = new Date(this.trip.startDate);
    const end = new Date(this.trip.endDate);

    this.isOngoing = this.trip.status === TripStatus.ONGOING;
    this.daysUntil = Math.max(0, Math.ceil((start.getTime() - now.getTime()) / 86_400_000));
    this.daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));

    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    this.formattedDateRange = `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`;
  }

  getBadgeColor(status: TripStatus): string {
    switch (status) {
      case TripStatus.PLANNING:
        return 'bg-primary';
      case TripStatus.ONGOING:
        return 'bg-secondary-dark';
      case TripStatus.FINISHED:
        return 'bg-stone-400';
      case TripStatus.CANCELED:
        return 'bg-accent';
      default:
        return 'bg-tertiary';
    }
  }
}
