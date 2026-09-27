import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { selectCreatePackingItemError, selectCreatingPackingItem, selectUpdatePackingItemError, selectUpdatingPackingItem } from '../store/packing-list.selectors';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreatePackingListItemPayload, PackingCategory, PackingList, PackingListItem, UpdatePackingListItemPayload } from '../packing-list.models';
import { Actions, ofType } from '@ngrx/effects';
import { CreatePackingItemActions, UpdatePackingItemActions } from '../store/packing-list.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe, ReactiveFormsModule],
  selector: 'app-create-update-item',
  templateUrl: './create-update-item.html',
})
export class CreateUpdateItem implements OnInit {
  @Input() item: PackingListItem | null = null;
  @Input({ required: true }) tripId!: number;
  @Input() defaultType: PackingList = PackingList.PERSONAL;
  @Output() closed = new EventEmitter();

  private store = inject(Store);
  private actions$ = inject(Actions);
  protected isEditMode = false;

  isSaving$!: Observable<boolean>;
  error$!: Observable<string | null>;
  
  categories = Object.values(PackingCategory);
  types = Object.values(PackingList);

  private fb = inject(FormBuilder);
  itemForm = this.fb.group({
    text: ['', Validators.required],
    type: [PackingList.PERSONAL, Validators.required],
    category: [PackingCategory.MISCELLANEOUS, Validators.required]
  });

  constructor() {
    this.actions$.pipe(
      ofType(CreatePackingItemActions.createPackingItemSuccess), takeUntilDestroyed())
      .subscribe(() => this.close());
  }

  ngOnInit(): void {
    this.isEditMode = !!this.item;

    if (this.isEditMode) {
      this.isSaving$ = this.store.select(selectUpdatingPackingItem);
      this.error$ = this.store.select(selectUpdatePackingItemError);
      this.store.dispatch(UpdatePackingItemActions.clearPackingItemError());
      this.patchFormFromItem(this.item!);
    }
    else {
      this.isSaving$ = this.store.select(selectCreatingPackingItem);
      this.error$ = this.store.select(selectCreatePackingItemError);
      this.store.dispatch(CreatePackingItemActions.clearCreateError());

      this.itemForm.patchValue({
        type: this.defaultType
      });
    }
  }

  private patchFormFromItem(item: PackingListItem) {
    this.itemForm.patchValue({
      text: item.text,
      type: item.listType,
      category: item.category
    });
  }

  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const { text, type, category } = this.itemForm.getRawValue();

    if (this.isEditMode) {
      const payload: UpdatePackingListItemPayload = {
        text: text!,
        listType: type!,
        category: category!

      };
      this.store.dispatch(UpdatePackingItemActions.updatePackingItem({ tripId: this.tripId, id: this.item!.id, payload }));
    }
    else {
      const payload: CreatePackingListItemPayload = {
        text: text!,
        listType: type!,
        category: category!
      }
      this.store.dispatch(CreatePackingItemActions.createPackingItem({ tripId: this.tripId, payload }));
    }
  }

  close(isSaving?: boolean | null) {
    if (!isSaving) this.closed.emit();
  }
}
