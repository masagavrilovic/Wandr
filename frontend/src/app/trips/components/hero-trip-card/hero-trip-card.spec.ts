import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroTripCard } from './hero-trip-card';

describe('HeroTripCard', () => {
  let component: HeroTripCard;
  let fixture: ComponentFixture<HeroTripCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroTripCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroTripCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
