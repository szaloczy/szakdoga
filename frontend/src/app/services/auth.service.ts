import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../../types';
import { I18nService } from '../shared/i18n.pipe';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  i18nService = inject(I18nService);

  private TOKEN_KEY = 'accessToken';
  router = inject(Router);

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  adminAccess(): boolean {
    const isLoggedIn = this.isLoggedIn();

    if(!isLoggedIn) {
      this.router.navigateByUrl("/login");
    } else if (this.decodeToken()?.role != "admin") {
      this.router.navigateByUrl("");
    }
    return isLoggedIn;
  }

  preventGuestAccess(): boolean {
    const isLoggedIn = this.isLoggedIn();

    if(!isLoggedIn) {
      this.router.navigateByUrl("/login");
    } else if (this.decodeToken()?.role == "admin") {
      this.router.navigateByUrl("/admin");
    }
    return isLoggedIn;
  }

  decodeToken(): any {
    const token = this.getToken();
    if(!token) {
      return null;
    }
    
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }


  getUserName(): string {
    const firstname = this.decodeToken()?.firstname || 'Ismeretlen';
    const lastname = this.decodeToken()?.lastname || '';
    console.log(firstname);
    return firstname + " " + lastname;
  }
  
  getUserRole(): string {
    switch (this.decodeToken()?.role) {
      case 'admin': return this.i18nService.transform('role.admin');
      case 'student': return this.i18nService.transform('role.student');
      case 'mentor' : return this.i18nService.transform('role.mentor');
      default: return 'Ismeretlen';
    }
  }

  getUserId(): number {
    return this.decodeToken()?.id;
  }
}
