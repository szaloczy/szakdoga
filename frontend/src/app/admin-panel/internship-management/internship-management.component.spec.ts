import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipManagementComponent } from './internship-management.component';

describe('InternshipManagementComponent', () => {
  let component: InternshipManagementComponent;
  let fixture: ComponentFixture<InternshipManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
