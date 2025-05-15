import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  fb = inject(FormBuilder);
  userService = inject(UserService);
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

    }
  }
}
