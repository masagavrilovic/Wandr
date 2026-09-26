import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackingItem } from './packing-item';

describe('PackingItem', () => {
  let component: PackingItem;
  let fixture: ComponentFixture<PackingItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackingItem],
    }).compileComponents();

    fixture = TestBed.createComponent(PackingItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
