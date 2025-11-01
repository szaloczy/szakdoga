import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { I18nService } from '../../shared/i18n.pipe';
import { InternshipHourService } from '../../services/internship-hour.service';
import { ToastService } from '../../services/toast.service';
import { CreateInternshipHourDTO } from '../../../types';

@Component({
  selector: 'app-hour-logging-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, I18nService],
  templateUrl: './hour-logging-modal.component.html',
  styleUrl: './hour-logging-modal.component.scss'
})
export class HourLoggingModalComponent implements OnInit {
  @Input() show = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() hourLogged = new EventEmitter<void>();

  i18nService = inject(I18nService);
  fb = inject(FormBuilder);
  internshipHourService = inject(InternshipHourService);
  toastService = inject(ToastService);

  hourForm!: FormGroup;
  isSubmitting = false;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const today = new Date().toISOString().split('T')[0];
    
    this.hourForm = this.fb.group({
      date: [today, [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  close() {
    this.hourForm.reset();
    this.initForm();
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.hourForm.invalid) {
      this.hourForm.markAllAsTouched();
      return;
    }

    const formValue = this.hourForm.value;
    
    // Validate that end time is after start time
    if (formValue.startTime >= formValue.endTime) {
      this.toastService.showError(
        this.i18nService.transform('dashboard.student.hour_logging.error_invalid_time')
      );
      return;
    }

    const hourData: CreateInternshipHourDTO = {
      date: formValue.date,
      startTime: formValue.startTime,
      endTime: formValue.endTime,
      description: formValue.description
    };

    this.isSubmitting = true;

    this.internshipHourService.create(hourData).subscribe({
      next: () => {
        this.toastService.showSuccess(
          this.i18nService.transform('dashboard.student.hour_logging.success')
        );
        this.hourForm.reset();
        this.initForm();
        this.hourLogged.emit();
        this.close();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error logging hour:', err);
        this.toastService.showError(
          this.i18nService.transform('dashboard.student.hour_logging.error')
        );
        this.isSubmitting = false;
      }
    });
  }

  calculateDuration(): string {
    const startTime = this.hourForm.get('startTime')?.value;
    const endTime = this.hourForm.get('endTime')?.value;

    if (!startTime || !endTime) {
      return '0:00';
    }

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    if (end <= start) {
      return '0:00';
    }

    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  get maxDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
