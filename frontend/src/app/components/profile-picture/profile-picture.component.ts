import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { I18nService } from '../../shared/i18n.pipe';
import { ProfilePictureService } from '../../services/profile-picture.service';

@Component({
  selector: 'app-profile-picture',
  standalone: true,
  imports: [CommonModule, I18nService],
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent {
  @Input() currentPicture?: string;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() editable: boolean = true;
  @Output() pictureChanged = new EventEmitter<string | undefined>();

  userService = inject(UserService);
  toastService = inject(ToastService);
  i18nService = inject(I18nService);
  profilePictureService = inject(ProfilePictureService);

  isUploading = false;

  get profilePictureUrl(): string | undefined {
    if (this.currentPicture) {
      return this.userService.getProfilePictureUrl(this.currentPicture);
    }
    return undefined;
  }

  get sizeClass(): string {
    switch (this.size) {
      case 'small': return 'profile-picture-small';
      case 'large': return 'profile-picture-large';
      default: return 'profile-picture-medium';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.toastService.showError(this.i18nService.transform('profile_picture.messages.invalid_format'));
        input.value = '';
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.toastService.showError(this.i18nService.transform('profile_picture.messages.file_too_large'));
        input.value = '';
        return;
      }

      this.uploadProfilePicture(file);
    }
  }

  uploadProfilePicture(file: File): void {
    this.isUploading = true;
    
    this.userService.uploadProfilePicture(file).subscribe({
      next: (response) => {
        this.currentPicture = response.profilePicture;
        this.pictureChanged.emit(this.currentPicture);
        this.profilePictureService.updateProfilePicture(this.currentPicture);
        this.toastService.showSuccess(this.i18nService.transform('profile_picture.messages.upload_success'));
        this.isUploading = false;
      },
      error: (error) => {
        console.error('Error uploading profile picture:', error);
        this.toastService.showError(this.i18nService.transform('profile_picture.messages.upload_error'));
        this.isUploading = false;
      }
    });
  }

  deleteProfilePicture(): void {
    this.userService.deleteProfilePicture().subscribe({
      next: () => {
        this.currentPicture = undefined;
        this.pictureChanged.emit(undefined);
        this.profilePictureService.updateProfilePicture(undefined);
        this.toastService.showSuccess(this.i18nService.transform('profile_picture.messages.delete_success'));
      },
      error: (error) => {
        console.error('Error deleting profile picture:', error);
        this.toastService.showError(this.i18nService.transform('profile_picture.messages.delete_error'));
      }
    });
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('profile-picture-input') as HTMLInputElement;
    fileInput?.click();
  }
}