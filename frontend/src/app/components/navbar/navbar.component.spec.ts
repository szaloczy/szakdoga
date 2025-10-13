import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ProfilePictureService } from '../../services/profile-picture.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { ProfileDTO, UserRole } from '../../../types';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let profilePictureService: jasmine.SpyObj<ProfilePictureService>;

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
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getProfile', 'getProfilePictureUrl']);
    const profilePictureServiceSpy = jasmine.createSpyObj('ProfilePictureService', ['updateProfilePicture'], {
      profilePicture$: new BehaviorSubject<string | undefined>('test-picture.jpg')
    });

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: ProfilePictureService, useValue: profilePictureServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    profilePictureService = TestBed.inject(ProfilePictureService) as jasmine.SpyObj<ProfilePictureService>;

    authService.getUserId.and.returnValue(1);
    userService.getProfile.and.returnValue(of(mockProfile));
    userService.getProfilePictureUrl.and.returnValue('http://example.com/profile.jpg');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', () => {
    fixture.detectChanges(); // This calls ngOnInit

    expect(authService.getUserId).toHaveBeenCalled();
    expect(userService.getProfile).toHaveBeenCalledWith(1);
    expect(component.currentUser).toEqual(mockProfile);
    expect(component.isLoadingProfile).toBeFalse();
  });

  it('should handle profile loading error', () => {
    userService.getProfile.and.returnValue(throwError(() => new Error('Loading failed')));
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(component.isLoadingProfile).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('should emit toggle sidebar event', () => {
    spyOn(component.toggleSidebar, 'emit');

    component.onToggleSidebar();

    expect(component.toggleSidebar.emit).toHaveBeenCalled();
  });

  it('should update profile picture when service emits new value', () => {
    component.currentUser = { ...mockProfile };
    fixture.detectChanges();

    const newPicture = 'new-picture.jpg';
    (profilePictureService.profilePicture$ as BehaviorSubject<string | undefined>).next(newPicture);

    expect(component.currentUser?.profilePicture).toBe(newPicture);
  });

  it('should handle profile picture change', () => {
    component.currentUser = { ...mockProfile };
    const newPicture = 'updated-picture.jpg';

    component.onProfilePictureChanged(newPicture);

    expect(component.currentUser?.profilePicture).toBe(newPicture);
  });

  it('should handle profile picture removal', () => {
    component.currentUser = { ...mockProfile };

    component.onProfilePictureChanged(undefined);

    expect(component.currentUser?.profilePicture).toBeUndefined();
  });

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    spyOn(component['profilePictureSubscription']!, 'unsubscribe');

    component.ngOnDestroy();

    expect(component['profilePictureSubscription']!.unsubscribe).toHaveBeenCalled();
  });
});
