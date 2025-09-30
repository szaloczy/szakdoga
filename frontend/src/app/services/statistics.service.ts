import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Statistics, ProgressStatistics, DashboardProgress, AdminStatistics } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  http = inject(HttpClient);

  getHoursPerMonth() { return this.http.get<Statistics>(`/api/statistics/hours-per-month`) };

  getStatusDistribution() { return this.http.get<Statistics>(`/api/statistics/hour-status-distribution`) };

  getCumulativeHours() { return this.http.get<Statistics>(`/api/statistics/cumulative-hours`) };

  getMentorHoursPerMonth() { return this.http.get<Statistics>(`/api/statistics/mentor/hours-per-month`) };

  getMentorStatusDistribution() { return this.http.get<Statistics>(`/api/statistics/mentor/hour-status-distribution`) };

  getMentorCumulativeHours() { return this.http.get<Statistics>(`/api/statistics/mentor/cumulative-hours`) };

  getProgressStatistics() { return this.http.get<ProgressStatistics>(`/api/statistics/progress`) };

  getDashboardProgress() { return this.http.get<DashboardProgress>(`/api/statistics/dashboard-progress`) };

  getAdminStatistics() { return this.http.get<AdminStatistics>(`/api/statistics/admin`) };
}
