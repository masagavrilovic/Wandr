import { Component, inject, Input, OnInit } from '@angular/core';
import { Trip, TripStatus } from '../../trips.models';
import { Router } from '@angular/router';
import { DateRangePipe, ImageUrlPipe, TripBadgeColorPipe } from '../../trips.pipes';
import { NgClass } from '@angular/common';

@Component({
  imports: [DateRangePipe, ImageUrlPipe, TripBadgeColorPipe, NgClass],
  standalone: true,
  selector: 'app-hero-trip-card',
  templateUrl: './hero-trip-card.html',
})
export class HeroTripCard implements OnInit{
  @Input({ required: true }) trip!: Trip;
  private router = inject(Router);

  now = new Date();
  start!: Date;
  end!: Date;
  isOngoing!: boolean;
  daysUntil!: number;
  daysLeft!: number;

  ngOnInit(): void {
    this.start = new Date(this.trip.startDate);
    this.end = new Date(this.trip.endDate);
    this.isOngoing = this.trip.status === TripStatus.ONGOING;
    this.daysUntil = Math.max(0, Math.ceil((this.start.getTime() - this.now.getTime()) / 86_400_000));
    this.daysLeft = Math.max(0, Math.ceil((this.end.getTime() - this.now.getTime()) / 86_400_000));
  }

  navigateToTrip(): void {
    this.router.navigate(['/trips', this.trip.id]);
  }
}
