import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { I18nService } from '../../shared/i18n.pipe';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    I18nService
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isCollapsed = false;

  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  logout() {
    this.authService.removeToken();
    this.router.navigateByUrl('/login');
    this.toastService.showSuccess('Sikeres kijelentkezés');
  }
}
