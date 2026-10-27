import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembersTab } from './members-tab';

describe('MembersTab', () => {
  let component: MembersTab;
  let fixture: ComponentFixture<MembersTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersTab],
    }).compileComponents();

    fixture = TestBed.createComponent(MembersTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
