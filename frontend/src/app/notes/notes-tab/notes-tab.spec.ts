import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesTab } from './notes-tab';

describe('NotesTab', () => {
  let component: NotesTab;
  let fixture: ComponentFixture<NotesTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesTab],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
