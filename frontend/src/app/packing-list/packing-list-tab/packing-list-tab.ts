import { Component, inject, Input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCreatePackingItemError, selectCreatingPackingItem, selectPackingItemDeleteErrors, selectPackingItemsLoading, selectPackingItemsLoadingError, selectPersonalPackingItemsGroupedByCategory, selectSharedPackingItemsGroupedByCategory } from '../store/packing-list.selectors';
import { AsyncPipe, NgClass } from '@angular/common';
import { PackingItem } from '../packing-item/packing-item';
import { PackingCategory, PackingList } from '../packing-list.models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreatePackingItemActions, DeletePackingItemActions } from '../store/packing-list.actions';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [PackingItem, NgClass, AsyncPipe, ReactiveFormsModule],
  selector: 'app-packing-list-tab',
  templateUrl: './packing-list-tab.html',
})
export class PackingListTab {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private route = inject(ActivatedRoute);
  private tripId = Number(this.route.parent?.snapshot.paramMap.get('id'));

  isLoading$ = this.store.select(selectPackingItemsLoading);
  loadError$ = this.store.select(selectPackingItemsLoadingError);
  personalItems$ = this.store.select(selectPersonalPackingItemsGroupedByCategory);
  sharedItems$ = this.store.select(selectSharedPackingItemsGroupedByCategory);

  isCreating$ = this.store.select(selectCreatingPackingItem);
  createError$ = this.store.select(selectCreatePackingItemError);

  deleteErrors$ = this.store.select(selectPackingItemDeleteErrors);

  protected activePersonalList = signal(true);
  protected showCreate = signal(false);
  protected categories = Object.values(PackingCategory);
  protected selectedCategory = PackingCategory.MISCELLANEOUS;

  private fb = inject(FormBuilder);
  itemForm = this.fb.group({
    text: ['', Validators.required],
    category: [PackingCategory.MISCELLANEOUS, Validators.required]
  });

  constructor() {
    this.actions$.pipe(
      ofType(CreatePackingItemActions.createPackingItemSuccess), takeUntilDestroyed())
      .subscribe(() => {
        this.closeCreateModal();
      }
    );
  }

  showPersonalList() {
    this.activePersonalList.set(true);
  }

  showSharedList() {
    this.activePersonalList.set(false);
  }

  openCreateModal(): void {
    this.showCreate.set(true);
  }

  closeCreateModal(): void {
    this.store.dispatch(CreatePackingItemActions.clearCreateError());
    this.showCreate.set(false);
  }

  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const { text, category } = this.itemForm.getRawValue();
    this.store.dispatch(CreatePackingItemActions.createPackingItem({
      tripId: this.tripId,
      payload: {
        text: text!,
        listType: this.activePersonalList() ? PackingList.PERSONAL : PackingList.SHARED,
        category: category!
      }
    }));
  }

    onDelete(id: number): void {
      this.store.dispatch(DeletePackingItemActions.deletePackingItem({ tripId: this.tripId, id }));
    }
  
    dismissDeleteError(id: number): void {
      this.store.dispatch(DeletePackingItemActions.clearDeleteError({ id }));
    }
}
