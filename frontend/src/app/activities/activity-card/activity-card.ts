import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { Activity } from '../activities.models';
import { DatePipe, SlicePipe } from '@angular/common';
import { getCategoryMeta } from '../activity-category-meta';

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

  get meta() {
    return getCategoryMeta(this.activity.category);
  }

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
