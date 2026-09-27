import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PackingListItem } from '../packing-list.models';
import { CreateUpdateItem } from '../create-update-item/create-update-item';

@Component({
  imports: [CreateUpdateItem],
  selector: 'app-packing-item',
  templateUrl: './packing-item.html',
})
export class PackingItem {
  @Input({ required: true }) item!: PackingListItem;
  @Input({ required: true }) tripId!: number;
  @Output() onDelete = new EventEmitter<number>();

  showDeleteModal = signal(false);
  showEditModal = signal(false);

  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  confirmDelete(): void {
    this.onDelete.emit(this.item.id);
    this.showDeleteModal.set(false);
  }

  openEditModal(): void {
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }
}
