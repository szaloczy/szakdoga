import { Component, inject, Input, OnInit } from '@angular/core';
import { CreateInternshipHourDTO, InternshipHourDTO, InternshipListDTO } from '../../../../types';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InternshipHourService } from '../../../services/internship-hour.service';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../shared/i18n.pipe';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-week-view',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, I18nService],
  templateUrl: './week-view.component.html',
  styleUrl: './week-view.component.scss'
})
export class WeekViewComponent implements OnInit {

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  internshipHourService = inject(InternshipHourService);
  toastService = inject(ToastService);
  i18nService = inject(I18nService);


  allEntries: InternshipHourDTO[] = [];
  todayEntries: InternshipHourDTO[] = [];
  selectedDate: Date = new Date();
  currentWeekStartDate: Date = this.getStartOfWeek(new Date());
  hourForm!: FormGroup;

  isModalOpen = false;

  @Input() internships: InternshipListDTO[] = [];

  getDayName(date: Date): string {
    const short = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    return this.i18nService.transform('days.' + short);
  }

  ngOnInit(): void {
    this.selectedDate.setHours(0, 0, 0, 0);

    this.hourForm = this.fb.group({
      startTime: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      endTime: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.loadHours();
  }

  loadHours(): void {
    this.internshipHourService.getMine().subscribe({
      next: (hours) => {
        this.allEntries = hours;
        this.filterTodayEntries();
      },
      error: (error) => {
        console.error('Hiba a gyakorlati órák lekérdezésekor:', error);
      }
    });
  }

  filterTodayEntries(): void {
    const dateStr = this.formatDate(this.selectedDate);
    this.todayEntries = this.allEntries.filter((entry) => entry.date === dateStr);
  }

  goToPreviousWeek() {
    const prev = new Date(this.currentWeekStartDate);
    prev.setDate(prev.getDate() - 7);
    this.currentWeekStartDate = this.getStartOfWeek(prev);
    this.selectDate(this.currentWeekStartDate);
  }

  getWeekRange(): string {
    const start = this.getWeekDates()[0];
    const end = this.getWeekDates()[6];
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return `${start.toLocaleDateString('hu-HU', options)} - ${end.toLocaleDateString('hu-HU', options)}`;
  }

  goToNextWeek() {
    const next = new Date(this.currentWeekStartDate);
    next.setDate(next.getDate() + 7);
    this.currentWeekStartDate = this.getStartOfWeek(next);
    this.selectDate(this.currentWeekStartDate);
  }

  getWeekDates(): Date[] {
    const today = new Date(this.selectedDate);
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  selectDate(date: Date): void {
    this.selectedDate = new Date(date);
    this.selectedDate.setHours(0, 0, 0, 0);
    this.filterTodayEntries();
  }

  getTotalForDay(date: Date): string {
    const dateStr = this.formatDate(date);
    const entries = this.allEntries.filter((e) => e.date === dateStr);
    const totalMinutes = entries.reduce((sum, e) => {
      const [sh, sm] = e.startTime.split(':').map(Number);
      const [eh, em] = e.endTime.split(':').map(Number);
      return sum + ((eh * 60 + em) - (sh * 60 + sm));
    }, 0);

    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0) {
      return `${h} ${this.i18nService.transform('time.hour')}${m > 0 ? ' ' + m + ' ' + this.i18nService.transform('time.minute') : ''}`;
    } else {
      return `${m} ${this.i18nService.transform('time.minute')}`;
    }
  }

  getDuration(start: string, end: string): string {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) {
      return `${h} ${this.i18nService.transform('time.hour')}${m > 0 ? ' ' + m + ' ' + this.i18nService.transform('time.minute') : ''}`;
    } else {
      return `${m} ${this.i18nService.transform('time.minute')}`;
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return d1.toDateString() === d2.toDateString();
  }

  openModal(): void {
    this.isModalOpen = true;
    this.hourForm.reset();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.hourForm.reset();
  }

  addHour(): void {
    if (this.hourForm.invalid) return;

    const payload: CreateInternshipHourDTO = {
      ...this.hourForm.value,
      date: this.formatDate(this.selectedDate),
    };

     this.internshipHourService.create(payload).subscribe({
      next: (response) => {
        this.toastService.showSuccess(this.i18nService.transform('response.hour_created'))
        this.closeModal();
        this.loadHours();
      },
      error: (err) => {
        console.error(err.error);
        this.toastService.showError(this.i18nService.transform('response.hour_invalid'+ `: ${err.error.message}`));
      }
    });
  }

  get hasApprovedInternship(): boolean {
    return this.internships.some((i: InternshipListDTO) => i.isApproved === true);
  }
}
