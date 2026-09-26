import { Component, Input } from '@angular/core';
import { PackingListItem } from '../packing-list.models';

@Component({
  imports: [],
  selector: 'app-packing-item',
  templateUrl: './packing-item.html',
})
export class PackingItem {
  @Input({ required: true }) item!: PackingListItem;
}
