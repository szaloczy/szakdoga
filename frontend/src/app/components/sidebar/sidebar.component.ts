import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { I18nService } from '../../shared/i18n.pipe';
import { UserService } from '../../services/user.service';
import { ProfilePictureService } from '../../services/profile-picture.service';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';
import { UserDTO, UserRole, ProfileDTO } from '../../../types';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    I18nService,
    ProfilePictureComponent,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = false;

  userService = inject(UserService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);
  profilePictureService = inject(ProfilePictureService);

  user: ProfileDTO = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    role: UserRole.STUDENT,
    profilePicture: undefined,
    student: undefined
  }

  private profilePictureSubscription?: Subscription;

  ngOnInit(): void {
    this.loadUserProfile();
    
    this.profilePictureSubscription = this.profilePictureService.profilePicture$.subscribe({
      next: (profilePicture) => {
        if (profilePicture !== undefined) {
          this.user.profilePicture = profilePicture;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.profilePictureSubscription?.unsubscribe();
  }

  loadUserProfile(): void {
    this.userService.getProfile(this.authService.getUserId()).subscribe({
      next: (userData) => {
        this.user = userData;
        this.profilePictureService.updateProfilePicture(userData.profilePicture);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onProfilePictureChanged(newPicture: string | undefined): void {
    this.user.profilePicture = newPicture;
    this.profilePictureService.updateProfilePicture(newPicture);
  }

  logout() {
    this.authService.removeToken();
    this.router.navigateByUrl('/login');
    this.toastService.showSuccess('Sikeres kijelentkezés');
  }
}
