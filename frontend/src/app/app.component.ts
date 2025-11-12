import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from "./shared/language-selector/language-selector.component";
import { ToastService } from './services/toast.service';
import { AuthService } from './services/auth.service';
import { ToastComponent } from './shared/toast/toast.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSelectorComponent, ToastComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  isAdminRoute = false;

  toastService = inject(ToastService);
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAdminRoute = event.url.includes('/admin') || 
                         event.url.includes('/users') || 
                         event.url.includes('/companies') || 
                         event.url.includes('/internships') || 
                         event.url.includes('/manage-documents') ||
                         event.url.includes('/admin-statistics');
    });
  }

  logout() {
    this.authService.removeToken();
    this.router.navigateByUrl('/login');
    this.toastService.showSuccess('Sikeres kijelentkezés');
  }
}
