import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { I18nService } from '../../shared/i18n.pipe';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    I18nService,
    RouterLink
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  userService = inject(UserService);
  i18nService = inject(I18nService);
  router = inject(Router);
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  registerForm!: FormGroup;
  submitted = false;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      terms: [false, []]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.toastService.showSuccess(this.i18nService.transform('register.success'));
          this.router.navigateByUrl("/login");
        },
        error: (err) => {
          this.toastService.showError(err.error.message)
        }
      });
    }
  }
  
}
