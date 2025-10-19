import { NgClass } from '@angular/common';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../shared/i18n.pipe';
import { UserDTO, UserRole, InternshipWithHours, MentorProfileDTO, StudentDTO, InternshipHourDTO, extendedStudentDTO, ProgressStatistics, DashboardProgress } from '../../../types';
import { StudentService } from '../../services/student.service';
import { InternshipHourService } from '../../services/internship-hour.service';
import { DocumentService } from '../../services/document.service';
import { UploadedDocument } from '../../../types';
import { UserService } from '../../services/user.service';
import { MentorService } from '../../services/mentor.service';
import { StatisticsService } from '../../services/statistics.service';
import { StudentListComponent } from '../../components/student-list/student-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    I18nService,
    NgClass,
    StudentListComponent,
    CommonModule,
    DatePipe,
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
  statisticsService = inject(StatisticsService);

  user: UserDTO | null = null;
  studentProfile: StudentDTO | null = null;
  internshipInfo: any = null;
  studentHours: InternshipHourDTO[] = [];
  studentHourStats = { approved: 0, pending: 0, rejected: 0 };
  studentDocuments: UploadedDocument[] = [];
  mentorProfile: MentorProfileDTO | null = null;
  mentorStudents: extendedStudentDTO[] = [];
  progressStats: ProgressStatistics | null = null;
  dashboardProgress: DashboardProgress | null = null;
  mentorStudentHourStats: { [studentId: number]: { approved: number; pending: number; rejected: number; total: number } } = {};
  mentorDocuments: UploadedDocument[] = [];
  mentorStats = { totalStudents: 0, activeStudents: 0, totalHours: 0, pendingHours: 0, documents: { pending: 0, approved: 0, rejected: 0 } };
  notifications: any[] = [];

  summaryCards: any[] = [];
  nextDeadline: { label: string; date: string } | null = null;

  mentorCards: any[] = [];
  isLoadingMentorData = false;

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
    this.studentService.getByUserId(userId).subscribe({
      next: (profile: StudentDTO) => {
        this.studentProfile = profile;
        this.internshipInfo = (profile as any).internship || null;
      }
    });
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
    this.documentService.getStudentDocuments().subscribe({
      next: (docs) => {
        this.studentDocuments = docs;
      }
    });
    
    // Load dashboard progress statistics
    this.statisticsService.getDashboardProgress().subscribe({
      next: (progress) => {
        this.dashboardProgress = progress;
      },
      error: (err) => {
        console.error('Error loading dashboard progress:', err);
      }
    });
  }

  private loadMentorDashboard(userId: number) {
    this.mentorService.getByUserId(userId).subscribe({
      next: (profile) => {
        this.mentorProfile = profile;
      }
    });
    this.mentorService.getStudents().subscribe({
      next: (students: extendedStudentDTO[]) => {
        console.log(students);
        this.mentorStudents = students;
        this.mentorStats.totalStudents = students.length;
        students.forEach(student => {
          console.log(student.id)
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
  }

  private loadMentorData(): void {
    this.isLoadingMentorData = true;

    this.mentorService.getByUserId(this.authService.getUserId()).subscribe({
      next: (mentorData) => {
        this.mentorProfile = mentorData;
        this.updateMentorCards();
      },
      error: (err) => console.error('Error loading mentor profile:', err)
    });

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
  }

  hasPendingHours(student: InternshipWithHours): boolean {
    return student.hours ? student.hours.some(h => h.status === 'pending') : false;
  }
}
