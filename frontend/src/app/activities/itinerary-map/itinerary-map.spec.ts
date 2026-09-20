import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItineraryMap } from './itinerary-map';

describe('ItineraryMap', () => {
  let component: ItineraryMap;
  let fixture: ComponentFixture<ItineraryMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItineraryMap],
    }).compileComponents();

    fixture = TestBed.createComponent(ItineraryMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
