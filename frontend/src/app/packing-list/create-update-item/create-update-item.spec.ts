import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUpdateItem } from './create-update-item';

describe('CreateUpdateItem', () => {
  let component: CreateUpdateItem;
  let fixture: ComponentFixture<CreateUpdateItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
