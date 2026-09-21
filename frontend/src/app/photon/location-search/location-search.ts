import { Component, forwardRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, Subject, switchMap } from 'rxjs';
import { LocationResult } from '../photon.models';
import { PhotonService } from '../photon.service';

type Status = 'idle' | 'loading' | 'done' | 'error';
interface SearchState { status: Status; items: LocationResult[]; }
let nextId = 0;

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LocationSearch),
    multi: true,
  }],
})
export class LocationSearch implements ControlValueAccessor {
  readonly inputId = input<string | null>(null);
  readonly listId = `location-search-list-${nextId++}`;

  readonly text = signal('');
  readonly selected = signal<LocationResult | null>(null);
  readonly items = signal<LocationResult[]>([]);
  readonly status = signal<Status>('idle');
  readonly open = signal(false);
  readonly activeIndex = signal(-1);
  readonly showHint = signal(false);
  readonly disabled = signal(false);

  private photon = inject(PhotonService);
  private query$ = new Subject<string>();
  private onChange: (v: LocationResult | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.query$.pipe(
      debounceTime(400),
      map(q => q.trim()),
      switchMap((q): Observable<SearchState> => {
        if (q.length < 3) return of<SearchState>({ status: 'idle', items: [] });
        return this.photon.autocomplete(q).pipe(
          map((items): SearchState => ({ status: 'done', items })),
          catchError(() => of<SearchState>({ status: 'error', items: [] })),
        );
      }),
      takeUntilDestroyed(),
    ).subscribe(({ status, items }) => {
      this.status.set(status);
      this.items.set(items);
      this.activeIndex.set(-1);
    });
  }

  writeValue(value: LocationResult | null): void {
    this.selected.set(value);
    this.text.set(value?.displayName ?? '');
    this.showHint.set(false);
    this.resetSearch();
  }
  registerOnChange(fn: (v: LocationResult | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }

  onInput(text: string): void {
    this.text.set(text);
    this.showHint.set(false);

    if (this.selected()) {
      this.selected.set(null);
      this.onChange(null);
    }

    const searchable = text.trim().length >= 3;
    this.status.set(searchable ? 'loading' : 'idle');
    this.open.set(searchable);
    this.query$.next(text);
  }

  select(item: LocationResult): void {
    this.selected.set(item);
    this.text.set(item.displayName);
    this.showHint.set(false);
    this.onChange(item);
    this.resetSearch();
  }

  clear(): void {
    this.text.set('');
    this.showHint.set(false);
    if (this.selected()) {
      this.selected.set(null);
      this.onChange(null);
    }
    this.resetSearch();
  }

  onBlur(): void {
    this.open.set(false);
    this.showHint.set(!!this.text().trim() && !this.selected());
    this.onTouched();
  }

  onKeydown(e: KeyboardEvent): void {
    const items = this.items();
    switch (e.key) {
      case 'ArrowDown':
        if (!items.length) return;
        e.preventDefault();
        this.open.set(true);
        this.activeIndex.update(i => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        if (!items.length) return;
        e.preventDefault();
        this.activeIndex.update(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        if (this.open()) {
          e.preventDefault();
          const item = items[this.activeIndex()];
          if (item) this.select(item);
        }
        break;
      case 'Escape':
        this.open.set(false);
        break;
    }
  }

  private resetSearch(): void {
    this.open.set(false);
    this.status.set('idle');
    this.items.set([]);
    this.activeIndex.set(-1);
    this.query$.next('');
  }
}