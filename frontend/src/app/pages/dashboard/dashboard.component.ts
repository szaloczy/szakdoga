import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgClass
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
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
