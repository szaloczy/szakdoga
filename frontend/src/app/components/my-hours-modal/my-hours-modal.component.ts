import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { I18nService } from '../../shared/i18n.pipe';
import { InternshipHourDTO } from '../../../types';

@Component({
  selector: 'app-my-hours-modal',
  standalone: true,
  imports: [CommonModule, I18nService],
  templateUrl: './my-hours-modal.component.html',
  styleUrl: './my-hours-modal.component.scss'
})
export class MyHoursModalComponent {
  @Input() show = false;
  @Input() hours: InternshipHourDTO[] = [];
  @Output() closeModal = new EventEmitter<void>();

  i18nService = inject(I18nService);

  selectedFilter: 'all' | 'approved' | 'pending' | 'rejected' = 'all';

  close() {
    this.closeModal.emit();
  }

  get filteredHours(): InternshipHourDTO[] {
    if (this.selectedFilter === 'all') {
      return this.hours;
    }
    return this.hours.filter(hour => hour.status === this.selectedFilter);
  }

  setFilter(filter: 'all' | 'approved' | 'pending' | 'rejected') {
    this.selectedFilter = filter;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'pending': return 'bg-warning text-dark';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'approved': return 'bi-check-circle-fill';
      case 'pending': return 'bi-hourglass-split';
      case 'rejected': return 'bi-x-circle-fill';
      default: return 'bi-question-circle';
    }
  }

  calculateDuration(startTime: string, endTime: string): string {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  get hoursByStatus() {
    return {
      all: this.hours.length,
      approved: this.hours.filter(h => h.status === 'approved').length,
      pending: this.hours.filter(h => h.status === 'pending').length,
      rejected: this.hours.filter(h => h.status === 'rejected').length
    };
  }
}
