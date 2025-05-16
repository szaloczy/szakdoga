import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgClass } from '@angular/common';
import { I18nService } from '../../shared/i18n.pipe';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    I18nService,
    RouterLink,
    NgClass,
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  i18nService = inject(I18nService);
  userService = inject(UserService);
  router = inject(Router);
  fb = inject(FormBuilder);
  loginForm!: FormGroup;
  showPassword = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if(this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe({
        next: () => {
          console.log("Sikeres bejelentkezés");
          this.router.navigateByUrl("");
        },
        error: (err) => {
          console.error("Hiba: " + err);
        }
      })
    }
  }
}
