import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LanguageSelectorComponent } from "./shared/language-selector/language-selector.component";
import { ToastService } from './services/toast.service';
import { AuthService } from './services/auth.service';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSelectorComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  toastService = inject(ToastService);
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.removeToken();
    this.router.navigateByUrl('/login');
    this.toastService.showSuccess('Sikeres kijelentkezés');
  }
}
