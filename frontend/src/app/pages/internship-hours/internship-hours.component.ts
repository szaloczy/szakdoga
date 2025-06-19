import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InternshipHourService } from '../../services/internship-hour.service';
import { CreateInternshipHourDTO } from '../../../types';

interface InternshipHour {
  date: string;         // ISO formátum: '2025-06-17'
  startTime: string;    // pl. '08:00'
  endTime: string;      // pl. '12:00'
  description: string;  // szöveges leírás
}


@Component({
  selector: 'app-internship-hours',
  imports: [ ReactiveFormsModule, CommonModule, FormsModule ],
  templateUrl: './internship-hours.component.html',
  styleUrl: './internship-hours.component.scss'
})
export class InternshipHoursComponent implements OnInit{

  fb = inject(FormBuilder);
  internshipHourService = inject(InternshipHourService);

  internshipHours: InternshipHour[] = [];
  selectedDate: Date = new Date();
  hourForm!: FormGroup;

  newHour: InternshipHour = {
    date: '',
    startTime: '',
    endTime: '',
    description: '',
  };

  modalInstance: null = null;
  isModalOpen = false;

  ngOnInit(): void {
    this.selectedDate.setHours(0, 0, 0, 0);

    this.hourForm = this.fb.group({
      startTime: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      endTime: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  // Aktuális hét napjait adja vissza (hétfőtől vasárnapig)
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

  // Kiválasztott nap módosítása
  selectDate(date: Date): void {
    this.selectedDate = new Date(date);
    this.selectedDate.setHours(0, 0, 0, 0);
  }

  // Az adott naphoz tartozó órák
  get todayEntries(): InternshipHour[] {
    const dateStr = this.formatDate(this.selectedDate);
    return this.internshipHours.filter((h) => h.date === dateStr);
  }

  // Órák időtartama (pl. 2 óra 15 perc)
  getDuration(start: string, end: string): string {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let minutes = (eh * 60 + em) - (sh * 60 + sm);
    if (minutes < 0) minutes += 24 * 60;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  // Napi összidő szövegesen
  getTotalForDay(date: Date): string {
    const dateStr = this.formatDate(date);
    const hours = this.internshipHours.filter((h) => h.date === dateStr);
    let totalMinutes = 0;
    for (const h of hours) {
      const [sh, sm] = h.startTime.split(':').map(Number);
      const [eh, em] = h.endTime.split(':').map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff < 0) diff += 24 * 60;
      totalMinutes += diff;
    }
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  }

  // Dátumformázás ISO formátumra
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  }

  // Kijelölt nap összehasonlítás
  isSameDay(d1: Date, d2: Date): boolean {
    return d1.toDateString() === d2.toDateString();
  }

  // Modál megnyitása
  openModal(): void {
  this.newHour = {
    date: this.formatDate(this.selectedDate),
    startTime: '',
    endTime: '',
    description: '',
  };
  this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  addHour(): void {
    if (this.hourForm.invalid) return;

    const payload = {
      ...this.hourForm.value,
      date: this.formatDate(new Date()),
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
