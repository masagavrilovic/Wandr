import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal, booleanAttribute } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, Subject, catchError, merge, startWith, switchMap, tap } from 'rxjs';
import { ExchangeRateService } from '../exchange-rate.service';

export type RateState = 'idle' | 'loading' | 'same' | 'auto' | 'error';

@Component({
  selector: 'app-exchange-rate-field',
  imports: [ReactiveFormsModule],
  templateUrl: './exchange-rate-field.html',
})
export class ExchangeRateField implements OnInit {
  @Input({ required: true }) currencyControl!: FormControl<string | null>;
  @Input({ required: true }) dateControl!: FormControl<string | null>;
  @Input({ required: true }) rateControl!: FormControl<number | null>;
  @Input({ required: true }) baseCurrency!: string;
  @Input({ transform: booleanAttribute }) skipInitialFetch = false;

  @Output() stateChange = new EventEmitter<RateState>();

  private exchangeRateService = inject(ExchangeRateService);
  private destroyRef = inject(DestroyRef);
  private refresh$ = new Subject<void>();

  state = signal<RateState>('idle');
  manualRate = signal(false);

  get rateEditable(): boolean {
    return this.manualRate() || this.state() === 'error';
  }

  ngOnInit(): void {
    if (this.skipInitialFetch) {
      this.setState(this.currencyControl.value === this.baseCurrency ? 'same' : 'auto');
    }

    const triggers$ = merge(this.currencyControl.valueChanges, this.dateControl.valueChanges, this.refresh$);

    (this.skipInitialFetch ? triggers$ : triggers$.pipe(startWith(null)))
      .pipe(
        tap(() => this.manualRate.set(false)),
        switchMap(() => this.fetchRate()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  enableManualRate(): void {
    this.manualRate.set(true);
  }

  retryRate(): void {
    this.refresh$.next();
  }

  private setState(state: RateState): void {
    this.state.set(state);
    this.stateChange.emit(state);
  }

  private fetchRate() {
    const currency = this.currencyControl.value;
    const date = this.dateControl.value;

    if (!currency || !date) {
      this.setState('idle');
      return EMPTY;
    }

    if (currency === this.baseCurrency) {
      this.rateControl.setValue(1);
      this.setState('same');
      return EMPTY;
    }

    this.setState('loading');
    this.rateControl.setValue(null);

    return this.exchangeRateService.getRate(currency, this.baseCurrency, date).pipe(
      tap((rate) => {
        this.rateControl.setValue(rate);
        this.setState('auto');
      }),
      catchError(() => {
        this.rateControl.setValue(null);
        this.setState('error');
        return EMPTY;
      })
    );
  }
}