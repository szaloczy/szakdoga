import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { ProfilePictureService } from '../../services/profile-picture.service';
import { Router } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { ProfileDTO, UserRole } from '../../../types';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let profilePictureService: jasmine.SpyObj<ProfilePictureService>;
  let router: jasmine.SpyObj<Router>;

  const mockProfile: ProfileDTO = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    role: UserRole.STUDENT,
    profilePicture: 'test-picture.jpg',
    student: undefined
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId', 'removeToken']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getProfile']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showSuccess']);
    const profilePictureServiceSpy = jasmine.createSpyObj('ProfilePictureService', ['updateProfilePicture'], {
      profilePicture$: new BehaviorSubject<string | undefined>('test-picture.jpg')
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ProfilePictureService, useValue: profilePictureServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    profilePictureService = TestBed.inject(ProfilePictureService) as jasmine.SpyObj<ProfilePictureService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    authService.getUserId.and.returnValue(1);
    userService.getProfile.and.returnValue(of(mockProfile));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', () => {
    fixture.detectChanges();

    expect(authService.getUserId).toHaveBeenCalled();
    expect(userService.getProfile).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockProfile);
    expect(profilePictureService.updateProfilePicture).toHaveBeenCalledWith('test-picture.jpg');
  });

  it('should handle profile loading error', () => {
    userService.getProfile.and.returnValue(throwError(() => new Error('Loading failed')));
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalled();
  });

  it('should update profile picture when service emits new value', () => {
    fixture.detectChanges();

    const newPicture = 'new-picture.jpg';
    (profilePictureService.profilePicture$ as BehaviorSubject<string | undefined>).next(newPicture);

    expect(component.user.profilePicture).toBe(newPicture);
  });

  it('should handle profile picture change', () => {
    fixture.detectChanges();
    const newPicture = 'updated-picture.jpg';

    component.onProfilePictureChanged(newPicture);

    expect(component.user.profilePicture).toBe(newPicture);
    expect(profilePictureService.updateProfilePicture).toHaveBeenCalledWith(newPicture);
  });

  it('should logout successfully', () => {
    component.logout();

    expect(authService.removeToken).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    expect(toastService.showSuccess).toHaveBeenCalledWith('Sikeres kijelentkezés');
  });

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    spyOn(component['profilePictureSubscription']!, 'unsubscribe');

    component.ngOnDestroy();

    expect(component['profilePictureSubscription']!.unsubscribe).toHaveBeenCalled();
  });

  it('should handle collapsed state', () => {
    component.isCollapsed = true;
    fixture.detectChanges();

    expect(component.isCollapsed).toBeTrue();
  });
});
