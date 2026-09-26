import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PackingListItem } from '../packing-list.models';

@Component({
  imports: [],
  selector: 'app-packing-item',
  templateUrl: './packing-item.html',
})
export class PackingItem {
  @Input({ required: true }) item!: PackingListItem;
  @Output() onDelete = new EventEmitter<number>();

  showDeleteModal = signal(false);

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
}
