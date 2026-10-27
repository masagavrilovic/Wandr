import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUpdateNote } from './create-update-note';

describe('CreateUpdateNote', () => {
  let component: CreateUpdateNote;
  let fixture: ComponentFixture<CreateUpdateNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateNote],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateNote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
