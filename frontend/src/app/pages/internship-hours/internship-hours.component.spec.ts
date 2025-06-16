import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipHoursComponent } from './internship-hours.component';

describe('InternshipHoursComponent', () => {
  let component: InternshipHoursComponent;
  let fixture: ComponentFixture<InternshipHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipHoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
