import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUpdateExpense } from './create-update-expense';

describe('CreateUpdateExpense', () => {
  let component: CreateUpdateExpense;
  let fixture: ComponentFixture<CreateUpdateExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateExpense],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateExpense);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
