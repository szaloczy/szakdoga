import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InternshipHourService } from '../../services/internship-hour.service';
import { CreateInternshipHourDTO, InternshipHourDTO } from '../../../types';

@Component({
  selector: 'app-internship-hours',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './internship-hours.component.html',
  styleUrl: './internship-hours.component.scss'
})
export class InternshipHoursComponent implements OnInit {
  fb = inject(FormBuilder);
  internshipHourService = inject(InternshipHourService);

  allEntries: InternshipHourDTO[] = [];
  todayEntries: InternshipHourDTO[] = [];
  selectedDate: Date = new Date();
  hourForm!: FormGroup;

  isModalOpen = false;

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
    this.internshipHourService.getHours().subscribe({
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

  getWeekDates(): Date[] {
    const today = new Date(this.selectedDate);
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // hétfő
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  selectDate(date: Date): void {
    this.selectedDate = new Date(date);
    this.selectedDate.setHours(0, 0, 0, 0);
    this.filterTodayEntries(); // 👉 nap váltáskor szűrés
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
    return h > 0 ? `${h} óra ${m > 0 ? m + ' perc' : ''}` : `${m} perc`;
  }

  getDuration(start: string, end: string): string {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h} ó ${m > 0 ? m + ' p' : ''}` : `${m} perc`;
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
      date: this.formatDate(this.selectedDate), // ⬅ aktuálisan kiválasztott napra
    };

     this.internshipHourService.create(payload).subscribe({
      next: (response) => {
        console.log('Óra hozzáadva:', response);
        this.closeModal();
      },
      error: (error) => {
        console.error('Hiba az óra hozzáadásakor:', error);
      }
    });
  }
}
