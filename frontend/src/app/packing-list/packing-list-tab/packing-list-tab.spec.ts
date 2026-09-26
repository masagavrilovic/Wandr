import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackingListTab } from './packing-list-tab';

describe('PackingListTab', () => {
  let component: PackingListTab;
  let fixture: ComponentFixture<PackingListTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackingListTab],
    }).compileComponents();

    fixture = TestBed.createComponent(PackingListTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
