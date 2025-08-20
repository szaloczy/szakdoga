import { NgClass } from '@angular/common';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../shared/i18n.pipe';
import { UserDTO, UserRole, InternshipWithHours, MentorProfileDTO, StudentDTO, InternshipHourDTO } from '../../../types';
import { StudentService } from '../../services/student.service';
import { InternshipHourService } from '../../services/internship-hour.service';
import { DocumentService, UploadedDocument } from '../../services/document.service';
import { UserService } from '../../services/user.service';
import { MentorService } from '../../services/mentor.service';
import { StudentListComponent } from '../../components/student-list/student-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    I18nService,
    NgClass,
    StudentListComponent,
    CommonModule,
    DatePipe,
    TitleCasePipe
  ],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  userService = inject(UserService);
  mentorService = inject(MentorService);
  authService = inject(AuthService);
  studentService = inject(StudentService);
  internshipHourService = inject(InternshipHourService);
  documentService = inject(DocumentService);

  user: UserDTO | null = null;
  studentProfile: StudentDTO | null = null;
  internshipInfo: any = null;
  studentHours: InternshipHourDTO[] = [];
  studentHourStats = { approved: 0, pending: 0, rejected: 0 };
  studentDocuments: UploadedDocument[] = [];
  mentorProfile: MentorProfileDTO | null = null;
  mentorStudents: StudentDTO[] = [];
  mentorStudentHourStats: { [studentId: number]: { approved: number; pending: number; rejected: number; total: number } } = {};
  mentorDocuments: UploadedDocument[] = [];
  mentorStats = { totalStudents: 0, activeStudents: 0, totalHours: 0, pendingHours: 0, documents: { pending: 0, approved: 0, rejected: 0 } };
  notifications: any[] = [];

  // Student dashboard data
  summaryCards: any[] = [];
  nextDeadline: { label: string; date: string } | null = null;

  // Mentor dashboard data
  mentorCards: any[] = [];
  isLoadingMentorData = false;

  // Mentor quick actions
  mentorActions = [
    { label: 'Órák jóváhagyása', icon: 'bi-check-circle', action: 'approveHours', count: 0 },
    { label: 'Dokumentumok áttekintése', icon: 'bi-file-text', action: 'reviewDocs', count: 0 }
    // További műveletek API-ból tölthetők
  ];

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.userService.getOne(userId).subscribe({
      next: (userData) => {
        this.user = userData;
        if (this.authService.getRole() === 'student') {
          this.loadStudentDashboard(userId);
        }
        if (this.authService.getRole() === 'mentor') {
          this.loadMentorDashboard(userId);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private loadStudentDashboard(userId: number) {
    // Személyes adatok
    this.studentService.getByUserId(userId).subscribe({
      next: (profile: StudentDTO) => {
        this.studentProfile = profile;
        // Gyakornoki státusz, mentor, cég, időszak
        this.internshipInfo = (profile as any).internship || null;
      }
    });
    // Saját órák
    this.internshipHourService.getMine().subscribe({
      next: (hours: InternshipHourDTO[]) => {
        this.studentHours = hours;
        this.studentHourStats = {
          approved: hours.filter((h: InternshipHourDTO) => h.status === 'approved').length,
          pending: hours.filter((h: InternshipHourDTO) => h.status === 'pending').length,
          rejected: hours.filter((h: InternshipHourDTO) => h.status === 'rejected').length
        };
      }
    });
    // Dokumentumok
    this.documentService.getStudentDocuments().subscribe({
      next: (docs) => {
        this.studentDocuments = docs;
      }
    });
    // TODO: értesítések
  }

  private loadMentorDashboard(userId: number) {
    // Mentor profil
    this.mentorService.getByUserId(userId).subscribe({
      next: (profile) => {
        this.mentorProfile = profile;
      }
    });
    // Hallgatók listája
    this.mentorService.getStudents().subscribe({
      next: (students: StudentDTO[]) => {
        this.mentorStudents = students;
        this.mentorStats.totalStudents = students.length;
        // Statisztikák aggregálása minden hallgatóhoz tartozó órákból
        students.forEach(student => {
          this.internshipHourService.getStudentHourDetails(student.id).subscribe({
            next: (details: any) => {
              const hours = details.hours || [];
              this.mentorStudentHourStats[student.id] = {
                approved: hours.filter((h: InternshipHourDTO) => h.status === 'approved').length,
                pending: hours.filter((h: InternshipHourDTO) => h.status === 'pending').length,
                rejected: hours.filter((h: InternshipHourDTO) => h.status === 'rejected').length,
                total: hours.length
              };
            }
          });
        });
      }
    });
    // Hallgatók órái
  // Összesített statisztikák aggregálása a mentorStudentHourStats-ból (async, ezért csak megjelenítéskor aggregáld)
    // Dokumentumok
    // TODO: mentor dokumentumok végpont
    // this.documentService.getMentorDocuments().subscribe(...)
    // Statisztikák
    // TODO: mentor statisztika végpont
    // Értesítések
    // TODO: mentor notification végpont
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
    const studentsWithHours = Object.values(this.mentorStudentHourStats).filter(stats => stats.total > 0).length;
    const totalHours = Object.values(this.mentorStudentHourStats).reduce((sum, stats) => sum + stats.approved, 0);
    const pendingApprovals = Object.values(this.mentorStudentHourStats).reduce((sum, stats) => sum + stats.pending, 0);

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
