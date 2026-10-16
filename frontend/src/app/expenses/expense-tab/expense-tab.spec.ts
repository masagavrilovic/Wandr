import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseTab } from './expense-tab';

describe('ExpenseTab', () => {
  let component: ExpenseTab;
  let fixture: ComponentFixture<ExpenseTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseTab],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
