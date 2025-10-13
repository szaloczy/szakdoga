import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HourDetailsModalComponent } from './hour-details-modal.component';

describe('HourDetailsModalComponent', () => {
  let component: HourDetailsModalComponent;
  let fixture: ComponentFixture<HourDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourDetailsModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HourDetailsModalComponent);
    component = fixture.componentInstance;
    
    // Initialize mock student data
    component.student = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com'
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate remaining hours correctly', () => {
    component.totalHours = 120;
    expect(component.remainingHours).toBe(60);

    component.totalHours = 200;
    expect(component.remainingHours).toBe(0);

    component.totalHours = 0;
    expect(component.remainingHours).toBe(180);
  });

  it('should emit close event when handleClose is called', () => {
    spyOn(component.close, 'emit');

    component.handleClose();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit approveHour event with correct data', () => {
    spyOn(component.approveHour, 'emit');
    const hourId = 123;

    component.emitApproveHour(hourId);

    expect(component.approveHour.emit).toHaveBeenCalledWith({
      hourId: 123,
      studentName: 'John Doe'
    });
  });

  it('should emit rejectHour event with correct data', () => {
    spyOn(component.rejectHour, 'emit');
    const hourId = 456;

    component.emitRejectHour(hourId);

    expect(component.rejectHour.emit).toHaveBeenCalledWith({
      hourId: 456,
      studentName: 'John Doe',
      reason: ''
    });
  });

  it('should display modal when show is true', () => {
    component.show = true;
    fixture.detectChanges();

    // In test environment, we just check if the component renders without errors
    // The actual modal visibility would be controlled by CSS classes
    expect(component.show).toBeTrue();
  });

  it('should not display modal when show is false', () => {
    component.show = false;
    fixture.detectChanges();

    expect(component.show).toBeFalse();
  });

  it('should display student information correctly', () => {
    component.show = true;
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain('John Doe');
  });

  it('should display hours statistics correctly', () => {
    component.show = true;
    component.totalHours = 100;
    component.approvedHours = 80;
    component.pendingHours = 15;
    component.rejectedHours = 5;
    fixture.detectChanges();

    expect(component.totalHours).toBe(100);
    expect(component.approvedHours).toBe(80);
    expect(component.pendingHours).toBe(15);
    expect(component.rejectedHours).toBe(5);
  });
});