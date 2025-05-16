import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink
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
    this.toastService.showSuccess('Sikeres kijelentkezés')
  }
}
