import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Activity } from '../activities.models';
import { DatePipe, SlicePipe } from '@angular/common';
import { getCategoryMeta } from '../activity-category-meta';
import { CreateUpdateActivity } from '../create-update-activity/create-update-activity';

@Component({
  imports: [DatePipe, SlicePipe, CreateUpdateActivity],
  standalone: true,
  selector: 'app-activity-card',
  templateUrl: './activity-card.html',
})
export class ActivityCard {
  @Input({ required: true }) activity!: Activity;
  @Input({ required: true }) tripId!: number;
  @Output() onDelete = new EventEmitter<number>();

  showDeleteModal = signal(false);
  showEditModal = signal(false);

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

  openEditModal(): void {
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }
}
