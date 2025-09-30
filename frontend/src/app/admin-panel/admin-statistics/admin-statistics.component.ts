import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../shared/i18n.pipe';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { StatisticsService } from '../../services/statistics.service';
import { AdminStatistics } from '../../../types';

@Component({
  selector: 'app-admin-statistics',
  standalone: true,
  imports: [CommonModule, I18nService],
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.scss']
})
export class AdminStatisticsComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  toastService = inject(ToastService);
  i18nService = inject(I18nService);
  statisticsService = inject(StatisticsService);

  statistics: AdminStatistics = {
    users: { total: 0, students: 0, mentors: 0, admins: 0 },
    internships: { total: 0, approved: 0, pending: 0, completed: 0 },
    hours: { total: 0, approved: 0, pending: 0, rejected: 0 },
    companies: { total: 0, active: 0 },
    documents: { total: 0, approved: 0, pending: 0, rejected: 0 }
  };

  isLoading = false;

  ngOnInit(): void {
    if (!this.authService.adminAccess()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    
    this.statisticsService.getAdminStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
        this.isLoading = false;
        this.toastService.showSuccess(this.i18nService.transform('admin_statistics.messages.statistics_loaded'));
      },
      error: (error) => {
        console.error('Error loading admin statistics:', error);
        this.toastService.showError(this.i18nService.transform('admin_statistics.messages.loading_error'));
        this.isLoading = false;
      }
    });
  }

  exportStatistics(): void {
    const csvContent = this.generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-statistics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.toastService.showSuccess(this.i18nService.transform('admin_statistics.messages.statistics_exported'));
  }

  private generateCSVContent(): string {
    const headers = ['Category', 'Metric', 'Value'];
    const data = [
      ['Users', 'Total', this.statistics.users.total.toString()],
      ['Users', 'Students', this.statistics.users.students.toString()],
      ['Users', 'Mentors', this.statistics.users.mentors.toString()],
      ['Users', 'Admins', this.statistics.users.admins.toString()],
      ['Internships', 'Total', this.statistics.internships.total.toString()],
      ['Internships', 'Approved', this.statistics.internships.approved.toString()],
      ['Internships', 'Pending', this.statistics.internships.pending.toString()],
      ['Internships', 'Completed', this.statistics.internships.completed.toString()],
      ['Hours', 'Total', this.statistics.hours.total.toString()],
      ['Hours', 'Approved', this.statistics.hours.approved.toString()],
      ['Hours', 'Pending', this.statistics.hours.pending.toString()],
      ['Hours', 'Rejected', this.statistics.hours.rejected.toString()],
      ['Companies', 'Total', this.statistics.companies.total.toString()],
      ['Companies', 'Active', this.statistics.companies.active.toString()],
      ['Documents', 'Total', this.statistics.documents.total.toString()],
      ['Documents', 'Approved', this.statistics.documents.approved.toString()],
      ['Documents', 'Pending', this.statistics.documents.pending.toString()],
      ['Documents', 'Rejected', this.statistics.documents.rejected.toString()]
    ];

    return [headers, ...data]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  formatDuration(totalHours: number): string {
    const wholeHours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - wholeHours) * 60);
    
    const currentLanguage = this.i18nService.getLanguage();
    
    if (currentLanguage === 'hu') {
      if (minutes > 0) {
        return `${wholeHours}ó ${minutes}p`;
      } else {
        return `${wholeHours}ó`;
      }
    } else {
      if (minutes > 0) {
        return `${wholeHours}h ${minutes}m`;
      } else {
        return `${wholeHours}h`;
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  getCompletionRate(): number {
    return this.statistics.internships.total > 0 
      ? (this.statistics.internships.completed / this.statistics.internships.total) * 100 
      : 0;
  }

  getHoursApprovalRate(): number {
    return this.statistics.hours.total > 0 
      ? (this.statistics.hours.approved / this.statistics.hours.total) * 100 
      : 0;
  }

  getAvgHoursPerStudent(): number {
    return this.statistics.users.students > 0 
      ? this.statistics.hours.total / this.statistics.users.students 
      : 0;
  }

  getActiveCompaniesRate(): number {
    return this.statistics.companies.total > 0 
      ? (this.statistics.companies.active / this.statistics.companies.total) * 100 
      : 0;
  }
}