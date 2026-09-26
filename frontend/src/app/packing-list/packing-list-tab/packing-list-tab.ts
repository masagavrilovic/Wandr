import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectPackingItemsLoading, selectPackingItemsLoadingError, selectPersonalPackingItemsGroupedByCategory, selectSharedPackingItemsGroupedByCategory } from '../store/packing-list.selectors';
import { AsyncPipe, NgClass } from '@angular/common';
import { PackingItem } from '../packing-item/packing-item';

@Component({
  imports: [PackingItem, NgClass, AsyncPipe],
  selector: 'app-packing-list-tab',
  templateUrl: './packing-list-tab.html',
})
export class PackingListTab {
  private store = inject(Store);

  isLoading$ = this.store.select(selectPackingItemsLoading);
  loadError$ = this.store.select(selectPackingItemsLoadingError);
  personalItems$ = this.store.select(selectPersonalPackingItemsGroupedByCategory);
  sharedItems$ = this.store.select(selectSharedPackingItemsGroupedByCategory);

  activePersonalList = signal(true);

  showPersonalList() {
    this.activePersonalList.set(true);
  }

  showSharedList() {
    this.activePersonalList.set(false);
  }
}
