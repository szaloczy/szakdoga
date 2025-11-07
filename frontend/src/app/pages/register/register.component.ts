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
  currentLang: string = 'hu';

  ngOnInit(): void {
    this.currentLang = this.i18nService.getLanguage();
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  openPrivacyPolicy(event: Event): void {
    event.preventDefault();
    const pdfFileName = this.currentLang === 'hu' ? 'adatvedelmi_tajekoztato.pdf' : 'privacy_policy.pdf';
    const pdfPath = `documents/${pdfFileName}`;
    window.open(pdfPath, '_blank');
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.toastService.showSuccess(this.i18nService.transform('common_response.register.success_register'));
          this.router.navigateByUrl("/login");
        },
        error: (err) => {
          this.toastService.showError(err.error.message)
        }
      });
    }
  }
  
}
