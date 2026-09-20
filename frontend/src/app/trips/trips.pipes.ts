import { Pipe, PipeTransform } from '@angular/core';
import { TripStatus } from './trips.models';

@Pipe({
  name: 'tripBadgeColor',
  standalone: true
})

export class TripBadgeColorPipe implements PipeTransform {
  transform(status: TripStatus): string {
    switch (status) {
      case TripStatus.PLANNING:
        return 'bg-primary';
      case TripStatus.ONGOING:
        return 'bg-secondary';
      case TripStatus.FINISHED:
        return 'bg-stone-400';
      case TripStatus.CANCELED:
        return 'bg-accent';
      default:
        return 'bg-tertiary';
    }
  }
}

@Pipe({
  name: 'dateRange',
  standalone: true,
})
export class DateRangePipe implements PipeTransform {
  private readonly opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };

  transform(startDate: string | Date, endDate: string | Date): string {
    if (!startDate || !endDate) return '';

    const start = new Date(startDate);
    const end = new Date(endDate);

    return `${start.toLocaleDateString('en-US', this.opts)} - ${end.toLocaleDateString('en-US', this.opts)}`;
  }
}

@Pipe({
  name: 'imageUrl',
  standalone: true,
})
export class ImageUrlPipe implements PipeTransform {
  transform(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
  }
}