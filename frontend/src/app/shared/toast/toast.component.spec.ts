import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from '../../services/toast.service';
import { BehaviorSubject } from 'rxjs';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: jasmine.SpyObj<ToastService>;
  let messageSubject: BehaviorSubject<{ message: string | null, type: string }>;

  beforeEach(async () => {
    messageSubject = new BehaviorSubject<{ message: string | null, type: string }>({ message: null, type: '' });
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError'], {
      message$: messageSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with null message and empty class', () => {
    expect(component.message).toBeNull();
    expect(component.toastClass).toBe('');
  });

  it('should subscribe to message service on init', () => {
    fixture.detectChanges(); // This calls ngOnInit

    expect(component.message).toBeNull();
  });

  it('should display success message', fakeAsync(() => {
    fixture.detectChanges();

    messageSubject.next({ message: 'Success message', type: 'success' });
    tick();

    expect(component.message).toBe('Success message');
    expect(component.toastClass).toBe('success');

    tick(3000);
    expect(component.message).toBeNull();
  }));

  it('should display error message', fakeAsync(() => {
    fixture.detectChanges();

    messageSubject.next({ message: 'Error message', type: 'error' });
    tick();

    expect(component.message).toBe('Error message');
    expect(component.toastClass).toBe('error');

    tick(3000);
    expect(component.message).toBeNull();
  }));

  it('should clear message after 3 seconds', fakeAsync(() => {
    fixture.detectChanges();

    messageSubject.next({ message: 'Test message', type: 'info' });
    tick();

    expect(component.message).toBe('Test message');
    expect(component.toastClass).toBe('info');

    tick(2999);
    expect(component.message).toBe('Test message'); // Still visible

    tick(1);
    expect(component.message).toBeNull(); // Now cleared
  }));

  it('should handle multiple messages', fakeAsync(() => {
    fixture.detectChanges();

    // First message
    messageSubject.next({ message: 'First message', type: 'success' });
    tick();
    expect(component.message).toBe('First message');
    expect(component.toastClass).toBe('success');

    // Second message before first expires
    tick(1000);
    messageSubject.next({ message: 'Second message', type: 'error' });
    tick();
    expect(component.message).toBe('Second message');
    expect(component.toastClass).toBe('error');

    tick(3000);
    expect(component.message).toBeNull();
  }));

  it('should handle null message from service', fakeAsync(() => {
    fixture.detectChanges();

    messageSubject.next({ message: null, type: '' });
    tick();

    expect(component.message).toBeNull();
    expect(component.toastClass).toBe('');
  }));
});
