import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../shared/i18n.pipe';
import { UserDTO, UserRole } from '../../../types';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    I18nService,
    NgClass
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  userService = inject(UserService);
  authService = inject(AuthService);

  user: UserDTO = {
      id: 0,
      firstname: '',
      lastname: '',
      email: '',
      active: true,
      role: UserRole.STUDENT,
    }

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

  ngOnInit(): void {
     this.userService.getOne(this.authService.getUserId()).subscribe({
      next: (userData) => {
        this.user = userData;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
