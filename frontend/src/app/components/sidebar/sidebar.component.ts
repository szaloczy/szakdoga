import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { I18nService } from '../../shared/i18n.pipe';
import { UserService } from '../../services/user.service';
import { UserDTO, UserRole } from '../../../types';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    I18nService
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  @Input() isCollapsed = false;

  userService = inject(UserService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  user: UserDTO = {
    id: 0,
    firstname: '',
    lastname: '',
    role: UserRole.STUDENT,
  }

  ngOnInit(): void {
    this.userService.getOne(this.authService.getUserId()).subscribe({
      next: (userData) => {
        this.user = userData;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  logout() {
    this.authService.removeToken();
    this.router.navigateByUrl('/login');
    this.toastService.showSuccess('Sikeres kijelentkezés');
  }
}
