import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityCardList } from './activity-card-list';

describe('ActivityCardList', () => {
  let component: ActivityCardList;
  let fixture: ComponentFixture<ActivityCardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCardList],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityCardList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
