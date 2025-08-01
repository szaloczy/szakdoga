import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../shared/i18n.pipe';
import { UserDTO, UserRole, InternshipWithHours, MentorProfileDTO } from '../../../types';
import { UserService } from '../../services/user.service';
import { MentorService } from '../../services/mentor.service';
import { StudentListComponent } from '../../components/student-list/student-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    I18nService,
    NgClass,
    StudentListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  userService = inject(UserService);
  mentorService = inject(MentorService);
  authService = inject(AuthService);

  user: UserDTO = {
      id: 0,
      firstname: '',
      lastname: '',
      email: '',
      active: true,
      role: UserRole.STUDENT,
    }

  // Student dashboard data
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

  // Mentor dashboard data
  mentorCards: any[] = [];
  mentorStudents: InternshipWithHours[] = [];
  mentorProfile: MentorProfileDTO | null = null;
  isLoadingMentorData = false;

  // Mentor quick actions
  mentorActions = [
    { label: 'Órák jóváhagyása', icon: 'bi-check-circle', action: 'approveHours', count: 0 },
    { label: 'Dokumentumok áttekintése', icon: 'bi-file-text', action: 'reviewDocs', count: 0 },
    { label: 'Hallgatók üzenetek', icon: 'bi-chat-dots', action: 'messages', count: 0 },
    { label: 'Értékelések', icon: 'bi-star', action: 'evaluations', count: 0 }
  ];

  ngOnInit(): void {
     this.userService.getOne(this.authService.getUserId()).subscribe({
      next: (userData) => {
        this.user = userData;
        
        // Load mentor-specific data if user is a mentor
        if (this.authService.getRole() === 'mentor') {
          this.loadMentorData();
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private loadMentorData(): void {
    this.isLoadingMentorData = true;

    // Load mentor profile
    this.mentorService.getByUserId(this.authService.getUserId()).subscribe({
      next: (mentorData) => {
        this.mentorProfile = mentorData;
        this.updateMentorCards();
      },
      error: (err) => console.error('Error loading mentor profile:', err)
    });

    // Load mentor's students
    this.mentorService.getStudents().subscribe({
      next: (students) => {
        this.mentorStudents = students;
        this.updateMentorCards();
        this.isLoadingMentorData = false;
      },
      error: (err) => {
        console.error('Error loading mentor students:', err);
        this.isLoadingMentorData = false;
      }
    });
  }

  private updateMentorCards(): void {
    const totalStudents = this.mentorStudents.length;
    const studentsWithHours = this.mentorStudents.filter(s => s.hours && s.hours.length > 0).length;
    
    // Calculate total hours by calculating duration for each hour entry
    const totalHours = this.mentorStudents.reduce((sum, s) => {
      return sum + (s.hours ? s.hours.reduce((hourSum, h) => {
        // Calculate hours from startTime and endTime
        const start = new Date(`2000-01-01T${h.startTime}`);
        const end = new Date(`2000-01-01T${h.endTime}`);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return hourSum + (diffHours > 0 ? diffHours : 0);
      }, 0) : 0);
    }, 0);
    
    const pendingApprovals = this.mentorStudents.reduce((sum, s) => {
      return sum + (s.hours ? s.hours.filter(h => h.status === 'pending').length : 0);
    }, 0);

    this.mentorCards = [
      { 
        title: 'Mentorált hallgatók', 
        value: totalStudents.toString(), 
        bg: 'bg-primary',
        icon: 'bi-people-fill'
      },
      { 
        title: 'Aktív hallgatók', 
        value: studentsWithHours.toString(), 
        bg: 'bg-success',
        icon: 'bi-person-check-fill'
      },
      { 
        title: 'Jóváhagyásra vár', 
        value: pendingApprovals.toString(), 
        bg: 'bg-warning',
        icon: 'bi-clock-fill'
      },
      { 
        title: 'Összes mentorált óra', 
        value: `${Math.round(totalHours)}h`, 
        bg: 'bg-info',
        icon: 'bi-check-circle-fill'
      }
    ];

    // Update action counts
    this.mentorActions[0].count = pendingApprovals; // Órák jóváhagyása
  }

  // Mentor action handlers
  handleMentorAction(action: string): void {
    switch(action) {
      case 'approveHours':
        // Navigate to hours approval page
        console.log('Navigate to hours approval');
        break;
      case 'reviewDocs':
        // Navigate to document review page
        console.log('Navigate to document review');
        break;
      case 'messages':
        // Navigate to messages page
        console.log('Navigate to messages');
        break;
      case 'evaluations':
        // Navigate to evaluations page
        console.log('Navigate to evaluations');
        break;
    }
  }

  // Helper method to check if student has pending hours
  hasPendingHours(student: InternshipWithHours): boolean {
    return student.hours ? student.hours.some(h => h.status === 'pending') : false;
  }
}
