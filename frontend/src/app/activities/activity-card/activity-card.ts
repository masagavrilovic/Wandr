import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Activity } from '../activities.models';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  imports: [DatePipe, SlicePipe],
  standalone: true,
  selector: 'app-activity-card',
  templateUrl: './activity-card.html',
})
export class ActivityCard {
  @Input({ required: true }) activity!: Activity;
  @Output() onDelete = new EventEmitter<number>();

  showDeleteModal = signal(false);

  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  confirmDelete(): void {
    this.onDelete.emit(this.activity.id);
    this.showDeleteModal.set(false);
  }
}
