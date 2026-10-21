import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUpdatePayment } from './create-update-payment';

describe('CreateUpdatePayment', () => {
  let component: CreateUpdatePayment;
  let fixture: ComponentFixture<CreateUpdatePayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdatePayment],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdatePayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
