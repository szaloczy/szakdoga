import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { I18nService } from '../../shared/i18n.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeekViewComponent } from './week-view/week-view.component';
import { InternshipHourDTO, InternshipListDTO } from '../../../types';
import { InternshipHourService } from '../../services/internship-hour.service';

@Component({
  selector: 'app-internship-hours',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, I18nService, WeekViewComponent],
  templateUrl: './internship-hours.component.html',
  styleUrl: './internship-hours.component.scss'
})
export class InternshipHoursComponent implements OnInit {

  internshipHoursService = inject(InternshipHourService);

  selectedTab: 'week' |  'approved' | 'pending' = 'week';
  entries: InternshipHourDTO[] = [];
  status: string | undefined;

  ngOnInit(): void {
    this.handleTabChange('week');
  }

  handleTabChange(tab: 'week' | 'approved' | 'pending') {
    this.selectedTab = tab;

    if (tab === 'approved' || tab === 'pending') {
      this.loadEntries(tab);
    } else {
      this.entries = [];
    }
  }

  loadEntries(status?: any): void {
    this.internshipHoursService.getHours(status).subscribe({
      next: (hours) => {
        this.entries = hours;
      },
      error: (error) => {
        console.error('Error loading internship hours:', error);
      }
    })
  }
  
}
