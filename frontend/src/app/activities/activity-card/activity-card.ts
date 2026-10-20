import { Component, Input, signal } from '@angular/core';
import { Activity } from '../activities.models';
import { SlicePipe } from '@angular/common';
import { getCategoryMeta } from '../activity-category-meta';
import { CreateUpdateActivity } from '../create-update-activity/create-update-activity';

@Component({
  imports: [SlicePipe, CreateUpdateActivity],
  standalone: true,
  selector: 'app-activity-card',
  templateUrl: './activity-card.html',
})
export class ActivityCard {
  @Input({ required: true }) activity!: Activity;
  @Input({ required: true }) tripId!: number;

  showEditModal = signal(false);

  get meta() {
    return getCategoryMeta(this.activity.category);
  }

  openEditModal(): void {
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }
}
