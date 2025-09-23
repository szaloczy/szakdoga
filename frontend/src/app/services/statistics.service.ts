import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Statistics } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  http = inject(HttpClient);

  getHoursPerMonth() { return this.http.get<Statistics>(`/api/statistics/hours-per-month`) };

  getStatusDistribution() { return this.http.get<Statistics>(`/api/statistics/hour-status-distribution`) };

  getCumulativeHours() { return this.http.get<Statistics>(`/api/statistics/cumulative-hours`) };

  }
