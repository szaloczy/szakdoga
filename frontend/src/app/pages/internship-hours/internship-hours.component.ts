import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { I18nService } from '../../shared/i18n.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeekViewComponent } from './week-view/week-view.component';
import { InternshipHourDTO } from '../../../types';
import { InternshipHourService } from '../../services/internship-hour.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-internship-hours',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, WeekViewComponent, I18nService],
  templateUrl: './internship-hours.component.html',
  styleUrl: './internship-hours.component.scss'
})
export class InternshipHoursComponent implements OnInit {

  internshipHoursService = inject(InternshipHourService);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  i18nService = inject(I18nService);
  selectedTab: 'week' | 'approved' | 'pending' | 'rejected' = 'week';
  entries: InternshipHourDTO[] = [];
  filteredEntries: InternshipHourDTO[] = [];
  
  isLoading = false;
  error: string | null = null;
  
  totalHours = 0;
  approvedHours = 0;
  pendingHours = 0;
  rejectedHours = 0;
  
  searchTerm = '';
  dateFilter = '';
  statusFilter: string = '';

  ngOnInit(): void {
    this.handleTabChange('week');
    this.loadStatistics();
  }

  handleTabChange(tab: 'week' | 'approved' | 'pending' | 'rejected') {
    this.selectedTab = tab;
    this.error = null;

    if (tab === 'approved' || tab === 'pending' || tab === 'rejected') {
      this.loadEntries(tab);
    } else {
      this.entries = [];
      this.filteredEntries = [];
    }
  }

  loadEntries(status?: 'approved' | 'pending' | 'rejected'): void {
    this.isLoading = true;
    this.error = null;
    
    this.internshipHoursService.getMine(status).subscribe({
      next: (hours) => {
        this.entries = hours || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading internship hours:', error);
        this.error = 'Failed to load internship hours. Please try again.';
        this.toastService.showError('Failed to load internship hours');
        this.isLoading = false;
      }
    });
  }

  loadStatistics(): void {
    this.internshipHoursService.getMine().subscribe({
      next: (allHours) => {
        this.calculateStatistics(allHours || []);
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  private calculateStatistics(hours: InternshipHourDTO[]): void {
    this.approvedHours = this.calculateTotalHours(hours.filter(h => h.status === 'approved'));
    this.pendingHours = this.calculateTotalHours(hours.filter(h => h.status === 'pending'));
    this.rejectedHours = this.calculateTotalHours(hours.filter(h => h.status === 'rejected'));
    this.totalHours = this.approvedHours + this.pendingHours + this.rejectedHours;
  }

  calculateTotalHours(hours: InternshipHourDTO[]): number {
    return hours.reduce((total, hour) => {
      const duration = this.getDuration(hour.startTime, hour.endTime);
      return total + duration;
    }, 0);
  }

  getDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Hours
  }

  formatDuration(hours: number): string {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    const currentLanguage = this.i18nService.getLanguage();
    
    if (currentLanguage === 'hu') {
      return `${wholeHours}ó ${minutes}p`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  }

  applyFilters(): void {
    this.filteredEntries = this.entries.filter(entry => {
      const matchesSearch = !this.searchTerm || 
        entry.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDate = !this.dateFilter || 
        entry.date === this.dateFilter;
      
      return matchesSearch && matchesDate;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onDateFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.dateFilter = '';
    this.applyFilters();
  }

  exportToCSV(): void {
    if (this.filteredEntries.length === 0) {
      this.toastService.showError(this.i18nService.transform('common_response.csv_export.no_data_error'));
      return;
    }

    const headers = ['Date', 'Start Time', 'End Time', 'Duration', 'Description', 'Status'];
    const csvData = this.filteredEntries.map(entry => [
      entry.date,
      entry.startTime,
      entry.endTime,
      this.formatDuration(this.getDuration(entry.startTime, entry.endTime)),
      entry.description,
      entry.status
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `internship-hours-${this.selectedTab}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    this.toastService.showSuccess(this.i18nService.transform('common_response.csv_export.success_export'));
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'approved': return 'bi-check-circle-fill';
      case 'pending': return 'bi-hourglass-split';
      case 'rejected': return 'bi-x-circle-fill';
      default: return 'bi-question-circle';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved': return 'text-success';
      case 'pending': return 'text-warning';
      case 'rejected': return 'text-danger';
      default: return 'text-muted';
    }
  }

  approveAllPending(): void {
    const pendingEntries = this.entries.filter(e => e.status === 'pending');
    if (pendingEntries.length === 0) {
      this.toastService.showError('No pending entries to approve');
      return;
    }
    
    this.toastService.showSuccess(`Bulk approve functionality would approve ${pendingEntries.length} entries`);
  }

  getTotalDurationForStatus(status: string): number {
    return this.calculateTotalHours(this.entries.filter(e => e.status === status));
  }
  
}
