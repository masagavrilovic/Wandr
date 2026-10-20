import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Settlements } from './settlements';

describe('Settlements', () => {
  let component: Settlements;
  let fixture: ComponentFixture<Settlements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settlements],
    }).compileComponents();

    fixture = TestBed.createComponent(Settlements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
