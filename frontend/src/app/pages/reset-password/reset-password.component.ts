import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { I18nService } from "../../shared/i18n.pipe";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, I18nService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: boolean = false;
  token: string | null = null;
  toastService = inject(ToastService);
  i18nService = inject(I18nService);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5)]],
      passwordAgain: ['', [Validators.required,]]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const again = form.get('passwordAgain')?.value;
    return pass === again ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) {
      this.toastService.showError(this.i18nService.transform('reset_password.error.invalid_data_or_token'));
      return;
    }
    if (this.resetForm.value.password !== this.resetForm.value.passwordAgain) {
      this.toastService.showError(this.i18nService.transform('reset_password.error.passwords_mismatch'));
      return;
    }
    this.loading = true;
    this.error = null;
    this.userService.resetPassword(this.token, this.resetForm.value.password).subscribe({
      next: () => {
        this.success = true;
        this.toastService.showSuccess(this.i18nService.transform('reset_password.success'));
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
  this.error = err.error?.message || this.i18nService.transform('reset_password.error.unknown');
  this.toastService.showError(this.error || '');
        this.loading = false;
      }
    });
  }
}
