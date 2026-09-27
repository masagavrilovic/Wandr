import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectPackingItemDeleteErrors, selectPackingItemsLoading, selectPackingItemsLoadingError, selectPersonalPackingItemsGroupedByCategory, selectSharedPackingItemsGroupedByCategory } from '../store/packing-list.selectors';
import { AsyncPipe, NgClass } from '@angular/common';
import { PackingItem } from '../packing-item/packing-item';
import { PackingList, UpdatePackingListItemPayload } from '../packing-list.models';
import { DeletePackingItemActions, UpdatePackingItemActions } from '../store/packing-list.actions';
import { ActivatedRoute } from '@angular/router';
import { CreateUpdateItem } from '../create-update-item/create-update-item';

@Component({
  imports: [PackingItem, NgClass, AsyncPipe, CreateUpdateItem],
  selector: 'app-packing-list-tab',
  templateUrl: './packing-list-tab.html',
})
export class PackingListTab {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  protected tripId = Number(this.route.parent?.snapshot.paramMap.get('id'));

  isLoading$ = this.store.select(selectPackingItemsLoading);
  loadError$ = this.store.select(selectPackingItemsLoadingError);
  personalItems$ = this.store.select(selectPersonalPackingItemsGroupedByCategory);
  sharedItems$ = this.store.select(selectSharedPackingItemsGroupedByCategory);

  deleteErrors$ = this.store.select(selectPackingItemDeleteErrors);

  protected activePersonalList = signal(true);
  protected packingListEnum = PackingList;
  protected showCreate = signal(false);

  showPersonalList(): void {
    this.activePersonalList.set(true);
  }

  showSharedList(): void {
    this.activePersonalList.set(false);
  }

  onDelete(id: number): void {
    this.store.dispatch(DeletePackingItemActions.deletePackingItem({ tripId: this.tripId, id }));
  }

  dismissDeleteError(id: number): void {
    this.store.dispatch(DeletePackingItemActions.clearDeleteError({ id }));
  }

  openCreateModal(): void {
    this.showCreate.set(true);
  }

  closeCreateModal(): void {
    this.showCreate.set(false);
  }

  onItemCheckChange(event: { id: number; checked: boolean }) {
    const payload: UpdatePackingListItemPayload = { assigned: event.checked };
    this.store.dispatch(UpdatePackingItemActions.updatePackingItem({ tripId: this.tripId, id: event.id, payload }))
  }
}
