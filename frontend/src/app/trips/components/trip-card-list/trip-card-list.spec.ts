import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripCardList } from './trip-card-list';

describe('TripCardList', () => {
  let component: TripCardList;
  let fixture: ComponentFixture<TripCardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripCardList],
    }).compileComponents();

    fixture = TestBed.createComponent(TripCardList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
