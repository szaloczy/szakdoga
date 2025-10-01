import { Component, EventEmitter, Output, inject, OnInit, OnDestroy } from '@angular/core';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';
import { I18nService } from '../../shared/i18n.pipe';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ProfilePictureService } from '../../services/profile-picture.service';
import { ProfileDTO } from '../../../types';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [LanguageSelectorComponent, I18nService, ProfilePictureComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();

  authService = inject(AuthService);
  userService = inject(UserService);
  profilePictureService = inject(ProfilePictureService);

  currentUser: ProfileDTO | null = null;
  isLoadingProfile = false;
  private profilePictureSubscription?: Subscription;

  ngOnInit(): void {
    this.loadUserProfile();
    
    // Subscribe to profile picture changes
    this.profilePictureSubscription = this.profilePictureService.profilePicture$.subscribe({
      next: (profilePicture) => {
        if (this.currentUser && profilePicture !== undefined) {
          this.currentUser.profilePicture = profilePicture;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.profilePictureSubscription?.unsubscribe();
  }

  loadUserProfile(): void {
    this.isLoadingProfile = true;
    this.userService.getProfile(this.authService.getUserId()).subscribe({
      next: (profile) => {
        this.currentUser = profile;
        this.isLoadingProfile = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.isLoadingProfile = false;
      }
    });
  }

  onProfilePictureChanged(newPicture: string | undefined): void {
    if (this.currentUser) {
      this.currentUser.profilePicture = newPicture;
    }
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
