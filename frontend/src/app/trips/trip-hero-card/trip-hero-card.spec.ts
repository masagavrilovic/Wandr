import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripHeroCard } from './trip-hero-card';

describe('TripHeroCard', () => {
  let component: TripHeroCard;
  let fixture: ComponentFixture<TripHeroCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripHeroCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TripHeroCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
