import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePictureComponent } from './profile-picture.component';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { ProfilePictureService } from '../../services/profile-picture.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ProfilePictureComponent', () => {
  let component: ProfilePictureComponent;
  let fixture: ComponentFixture<ProfilePictureComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let profilePictureService: jasmine.SpyObj<ProfilePictureService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['uploadProfilePicture', 'deleteProfilePicture', 'getProfilePictureUrl']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);
    const profilePictureServiceSpy = jasmine.createSpyObj('ProfilePictureService', ['updateProfilePicture']);

    await TestBed.configureTestingModule({
      imports: [ProfilePictureComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ProfilePictureService, useValue: profilePictureServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePictureComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    profilePictureService = TestBed.inject(ProfilePictureService) as jasmine.SpyObj<ProfilePictureService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return profile picture URL when currentPicture is set', () => {
    const testPicture = 'test-picture.jpg';
    const expectedUrl = 'http://example.com/test-picture.jpg';
    component.currentPicture = testPicture;
    userService.getProfilePictureUrl.and.returnValue(expectedUrl);

    expect(component.profilePictureUrl).toBe(expectedUrl);
    expect(userService.getProfilePictureUrl).toHaveBeenCalledWith(testPicture);
  });

  it('should return undefined when currentPicture is not set', () => {
    component.currentPicture = undefined;

    expect(component.profilePictureUrl).toBeUndefined();
  });

  it('should return correct size class', () => {
    component.size = 'small';
    expect(component.sizeClass).toBe('profile-picture-small');

    component.size = 'large';
    expect(component.sizeClass).toBe('profile-picture-large');

    component.size = 'medium';
    expect(component.sizeClass).toBe('profile-picture-medium');
  });

  it('should validate file type on file selection', () => {
    const mockFile = new File([''], 'test.txt', { type: 'text/plain' });
    const mockEvent = {
      target: {
        files: [mockFile],
        value: ''
      }
    } as any;

    component.onFileSelected(mockEvent);

    expect(toastService.showError).toHaveBeenCalled();
    expect(mockEvent.target.value).toBe('');
  });

  it('should validate file size on file selection', () => {
    const largeMockFile = new File(['x'.repeat(6 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: {
        files: [largeMockFile],
        value: ''
      }
    } as any;

    component.onFileSelected(mockEvent);

    expect(toastService.showError).toHaveBeenCalled();
    expect(mockEvent.target.value).toBe('');
  });

  it('should upload profile picture successfully', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const mockResponse = { profilePicture: 'new-picture.jpg' };
    userService.uploadProfilePicture.and.returnValue(of(mockResponse));
    spyOn(component.pictureChanged, 'emit');

    component.uploadProfilePicture(mockFile);

    expect(userService.uploadProfilePicture).toHaveBeenCalledWith(mockFile);
    expect(component.currentPicture).toBe('new-picture.jpg');
    expect(component.pictureChanged.emit).toHaveBeenCalledWith('new-picture.jpg');
    expect(profilePictureService.updateProfilePicture).toHaveBeenCalledWith('new-picture.jpg');
    expect(toastService.showSuccess).toHaveBeenCalled();
    expect(component.isUploading).toBeFalse();
  });

  it('should handle upload error', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    userService.uploadProfilePicture.and.returnValue(throwError(() => new Error('Upload failed')));

    component.uploadProfilePicture(mockFile);

    expect(toastService.showError).toHaveBeenCalled();
    expect(component.isUploading).toBeFalse();
  });

  it('should delete profile picture successfully', () => {
    userService.deleteProfilePicture.and.returnValue(of({}));
    spyOn(component.pictureChanged, 'emit');

    component.deleteProfilePicture();

    expect(userService.deleteProfilePicture).toHaveBeenCalled();
    expect(component.currentPicture).toBeUndefined();
    expect(component.pictureChanged.emit).toHaveBeenCalledWith(undefined);
    expect(profilePictureService.updateProfilePicture).toHaveBeenCalledWith(undefined);
    expect(toastService.showSuccess).toHaveBeenCalled();
  });

  it('should handle delete error', () => {
    userService.deleteProfilePicture.and.returnValue(throwError(() => new Error('Delete failed')));

    component.deleteProfilePicture();

    expect(toastService.showError).toHaveBeenCalled();
  });

  it('should trigger file input', () => {
    const mockFileInput = jasmine.createSpyObj('HTMLInputElement', ['click']);
    spyOn(document, 'getElementById').and.returnValue(mockFileInput);

    component.triggerFileInput();

    expect(document.getElementById).toHaveBeenCalledWith('profile-picture-input');
    expect(mockFileInput.click).toHaveBeenCalled();
  });
});