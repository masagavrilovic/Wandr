import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripOverview } from './trip-overview';

describe('TripOverview', () => {
  let component: TripOverview;
  let fixture: ComponentFixture<TripOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(TripOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
