import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../shared/i18n.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [
    I18nService,
    NgClass
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  authService = inject(AuthService);

  user = {
    name: 'Kiss Anna'
  };

  summaryCards = [
    { title: 'Gyakorlat állapota', value: 'Elfogadva', bg: 'bg-success' },
    { title: 'Teljesített órák', value: '120 / 180', bg: 'bg-info' },
    { title: 'Helyszín', value: 'Minta Kft., Budapest', bg: 'bg-dark' },
    { title: 'Konzulens', value: 'Dr. Példa László', bg: 'bg-secondary' },
  ];

  nextDeadline = {
    label: 'Szakmai beszámoló',
    date: '2025. május 20.'
  };
}
