import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { I18nService } from '../../shared/i18n.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  imports: [
    RouterLink,
    I18nService
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.removeToken();
    this.router.navigateByUrl('/login');
  }
}
