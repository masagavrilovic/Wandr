import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExchangeRateField } from './exchange-rate-field';

describe('ExchangeRateField', () => {
  let component: ExchangeRateField;
  let fixture: ComponentFixture<ExchangeRateField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeRateField],
    }).compileComponents();

    fixture = TestBed.createComponent(ExchangeRateField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
