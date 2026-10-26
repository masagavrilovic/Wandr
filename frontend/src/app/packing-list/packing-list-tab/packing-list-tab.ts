import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectPackingItemDeleteErrors, selectPackingItemEntities, selectPackingItemsInitialLoading, selectPackingItemsLoadingError, selectPackingToggleErrors, selectPersonalPackingItemsGroupedByCategory, selectPersonalPackingProgress, selectSharedPackingItemsGroupedByCategory, selectSharedPackingProgress, selectTogglingIds } from '../store/packing-list.selectors';
import { AsyncPipe, NgClass } from '@angular/common';
import { PackingItem } from '../packing-item/packing-item';
import { PackingList } from '../packing-list.models';
import { DeletePackingItemActions, PackingTabActions, TogglePackingItemActions } from '../store/packing-list.actions';
import { CreateUpdateItem } from '../create-update-item/create-update-item';
import { combineLatest, switchMap, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { selectUser } from '../../auth/store/auth.selectors';
import { UserSummary } from '../../user/user.models';

@Component({
  imports: [PackingItem, NgClass, AsyncPipe, CreateUpdateItem],
  selector: 'app-packing-list-tab',
  templateUrl: './packing-list-tab.html',
})
export class PackingListTab implements OnInit {
  private store = inject(Store);

  initialLoading$ = this.store.select(selectPackingItemsInitialLoading);
  loadError$ = this.store.select(selectPackingItemsLoadingError);
  personalItems$ = this.store.select(selectPersonalPackingItemsGroupedByCategory);
  sharedItems$ = this.store.select(selectSharedPackingItemsGroupedByCategory);

  deleteErrors$ = this.store.select(selectPackingItemDeleteErrors);
  toggleErrors$ = this.store.select(selectPackingToggleErrors);
  togglingIds$ = this.store.select(selectTogglingIds);

  protected activePersonalList = signal(true);
  protected packingListEnum = PackingList;
  protected showCreate = signal(false);

  activeProgress$ = toObservable(this.activePersonalList).pipe(
    switchMap((isPersonal) =>
      isPersonal
        ? this.store.select(selectPersonalPackingProgress)
        : this.store.select(selectSharedPackingProgress)
    )
  );

  ngOnInit(): void {
    this.store.dispatch(PackingTabActions.opened());
  }

  showPersonalList(): void {
    this.activePersonalList.set(true);
  }

  showSharedList(): void {
    this.activePersonalList.set(false);
  }

  dismissDeleteError(id: number): void {
    this.store.dispatch(DeletePackingItemActions.clearDeleteError({ id }));
  }

  dismissToggleError(id: number): void {
    this.store.dispatch(TogglePackingItemActions.clearToggleError({ id }));
  }

  openCreateModal(): void {
    this.showCreate.set(true);
  }

  closeCreateModal(): void {
    this.showCreate.set(false);
  }

  onItemCheckChange(event: { id: number; checked: boolean }) {
    combineLatest([this.store.select(selectPackingItemEntities), this.store.select(selectUser)])
      .pipe(take(1))
      .subscribe(([entities, user]) => {
        const item = entities[event.id];
        if (!item || !user) return;

        const me: UserSummary = { id: user.id, firstName: user.firstName, lastName: user.lastName };
        this.store.dispatch(TogglePackingItemActions.togglePackingItem({
          id: event.id,
          assigned: event.checked,
          assignedTo: event.checked ? me : null,
          previousAssignedTo: item.assignedTo,
        }));
      });
  }
}
