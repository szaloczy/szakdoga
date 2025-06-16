import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface HourEntry {
  start: string; // '08:00'
  end: string;   // '10:00'
  description: string;
}


@Component({
  selector: 'app-internship-hours',
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './internship-hours.component.html',
  styleUrl: './internship-hours.component.scss'
})
export class InternshipHoursComponent implements OnInit{

 currentWeekStart = new Date();
  weekDays: Date[] = [];
  hoursByDay: { [date: string]: HourEntry[] } = {};

  modalVisible = false;
  selectedDay: string = '';
  newEntry: HourEntry = { start: '', end: '', description: '' };

  constructor() {
    this.setWeekDays();
  }

  ngOnInit(): void {
    
  }

  setWeekDays() {
    const monday = new Date(this.currentWeekStart);
    monday.setDate(monday.getDate() - monday.getDay() + 1); // hétfő
    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      this.weekDays.push(day);
    }
  }

  formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
  }

  getHoursForDay(date: Date): HourEntry[] {
    const key = this.formatDateKey(date);
    return this.hoursByDay[key] || [];
  }

  openAddModal(date: Date) {
    this.selectedDay = this.formatDateKey(date);
    this.newEntry = { start: '', end: '', description: '' };
    this.modalVisible = true;
  }

  addHourEntry() {
    const entry = { ...this.newEntry };
    if (!this.hoursByDay[this.selectedDay]) {
      this.hoursByDay[this.selectedDay] = [];
    }
    this.hoursByDay[this.selectedDay].push(entry);
    this.modalVisible = false;
  }

  prevWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.setWeekDays();
  }

  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.setWeekDays();
  }
}
