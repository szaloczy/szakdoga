import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgClass, CommonModule } from '@angular/common';
import { I18nService } from '../../shared/i18n.pipe';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    I18nService,
    RouterLink,
    NgClass,
    CommonModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  isForgotPasswordPopupOpen = false;

  isForgotPasswordModalOpen = false;
  forgotPasswordForm!: FormGroup;

  i18nService = inject(I18nService);
  userService = inject(UserService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);
  fb = inject(FormBuilder);
  loginForm!: FormGroup;
  showPassword = false;
  message: string | null = null;
  error: string | null = null;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  openForgotPasswordPopup(event: Event) {
    event.preventDefault();
    this.isForgotPasswordPopupOpen = true;
    this.forgotPasswordForm.reset();
  }

  closeForgotPasswordPopup() {
    this.isForgotPasswordPopupOpen = false;
    this.forgotPasswordForm.reset();
  }

  onForgotPasswordSubmit() {
    if (this.forgotPasswordForm.invalid) return;
    const email = this.forgotPasswordForm.value.email;
    this.userService.forgotPassword(email).subscribe({
      next: (res) => {
        this.message = 'Ha létezik ilyen email, küldtünk rá visszaállító linket!';
        this.error = null;
      },
      error: (err) => {
        this.error = err.error?.message || 'Hiba történt!';
        this.message = null;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if(this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log("Sikeres bejelentkezés");
          this.toastService.showSuccess("Sikeres bejelentkezés");
          this.authService.setToken(response.accessToken);
          if (this.authService.decodeToken()?.role == "admin") {
            this.router.navigateByUrl("/admin")
          } else {
            this.router.navigateByUrl("");
          }
        },
        error: (err) => {
          this.toastService.showError(err.error.message);
        }
      })
    }
  }
}
