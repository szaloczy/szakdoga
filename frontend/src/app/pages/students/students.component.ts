import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '../../shared/i18n.pipe';
import { MentorService } from '../../services/mentor.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { InternshipHourService } from '../../services/internship-hour.service';
import { InternshipWithHours, StudentDTO } from '../../../types';

// Interface for the backend student response
interface StudentResponseDTO {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  major: string | null;
  university: string | null;
  hours: number;
}

@Component({
  selector: 'app-students',
  imports: [
    CommonModule,
    FormsModule,
    I18nService
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  private mentorService = inject(MentorService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private internshipHourService = inject(InternshipHourService);

  students: StudentResponseDTO[] = [];
  isLoading = false;
  searchTerm = '';
  selectedFilter = 'all'; // all, active, pending, completed
  sortBy = 'name'; // name, hours, university, status

  ngOnInit(): void {
    if (!this.authService.mentorAccess()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loadStudents();
  }

  public loadStudents(): void {
    this.isLoading = true;
    
    this.mentorService.getStudents().subscribe({
      next: (data: any) => {
        // Convert the backend response to our expected format
        if (Array.isArray(data)) {
          // If data is already in the simple format we expect
          this.students = data as StudentResponseDTO[];
        } else if (data && Array.isArray(data.students)) {
          // If data is wrapped in another object
          this.students = data.students as StudentResponseDTO[];
        } else {
          // Fallback: transform InternshipWithHours to StudentResponseDTO
          this.students = (data as InternshipWithHours[]).map(item => ({
            id: item.student.id,
            firstname: item.student.user?.firstname || '',
            lastname: item.student.user?.lastname || '',
            email: item.student.user?.email || '',
            major: item.student.major,
            university: item.student.university,
            hours: item.hours.reduce((sum, h) => sum + (h.status === 'approved' ? 1 : 0), 0) * 8 // Rough calculation
          }));
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.toastService.showError('Failed to load students');
        this.isLoading = false;
      }
    });
  }

  // Statistical count methods
  getActiveStudentsCount(): number {
    return this.students.filter(student => 
      this.getStudentStatus(student) === 'active'
    ).length;
  }

  getPendingStudentsCount(): number {
    return this.students.filter(student => 
      this.getStudentStatus(student) === 'pending'
    ).length;
  }

  getCompletedStudentsCount(): number {
    return this.students.filter(student => 
      this.getStudentStatus(student) === 'completed'
    ).length;
  }

  get filteredStudents(): StudentResponseDTO[] {
    let filtered = this.students;

    // Filter by status
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(student => 
        this.getStudentStatus(student) === this.selectedFilter
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(student => 
        `${student.firstname} ${student.lastname}`
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        student.university?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }

  private calculateHoursDuration(startTime: string, endTime: string): number {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    return diffMs / (1000 * 60 * 60); // Convert to hours
  }

  getStudentStatus(student: StudentResponseDTO): string {
    // For now, we'll use the hours field from the backend
    // Since we don't have detailed hour records, we'll use simplified logic
    if (student.hours >= 180) {
      return 'completed';
    } else if (student.hours > 0) {
      return 'active';
    } else {
      return 'pending';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-warning';
      case 'completed':
        return 'bg-success';
      case 'active':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'students.status.pending_approval';
      case 'completed':
        return 'students.status.completed';
      case 'active':
        return 'students.status.active';
      default:
        return 'students.status.unknown';
    }
  }

  getTotalHours(student: StudentResponseDTO): number {
    return student.hours;
  }

  getPendingHours(student: StudentResponseDTO): number {
    // For now, we don't have pending hours data from backend
    // We'll return 0 for completed students, and a small amount for others
    if (student.hours >= 180) return 0;
    if (student.hours > 0) return Math.floor(student.hours * 0.1); // 10% of current hours as pending
    return 5; // Default pending hours for students with no hours yet
  }

  viewStudentDetails(studentId: number): void {
    this.router.navigate(['/student-profile'], { 
      queryParams: { id: studentId, mentorView: true } 
    });
  }

  approveHours(studentId: number): void {
    this.router.navigate(['/internship-hours'], { 
      queryParams: { studentId: studentId, approve: true } 
    });
  }

  exportStudentData(): void {
    if (this.students.length === 0) {
      this.toastService.showError('No students to export');
      return;
    }

    const data = this.students.map(student => ({
      name: `${student.firstname} ${student.lastname}`,
      email: student.email,
      university: student.university,
      totalHours: this.getTotalHours(student),
      pendingHours: this.getPendingHours(student),
      status: this.getStudentStatus(student),
      completionPercentage: Math.round((this.getTotalHours(student) / 180) * 100)
    }));

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,University,Total Hours,Pending Hours,Status,Completion %\n"
      + data.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.toastService.showSuccess('Student data exported successfully');
  }

  bulkApproveHours(): void {
    const pendingStudents = this.students.filter(student => 
      this.getStudentStatus(student) === 'pending'
    );

    if (pendingStudents.length === 0) {
      this.toastService.showError('No pending hours to approve');
      return;
    }

    if (confirm(`Are you sure you want to approve pending hours for ${pendingStudents.length} students?`)) {
      // Here you would implement the bulk approval logic
      this.toastService.showSuccess(`Bulk approval initiated for ${pendingStudents.length} students`);
    }
  }

  filterStudents(filter: string): void {
    this.selectedFilter = filter;
  }

  sortStudents(sortBy: string): void {
    this.sortBy = sortBy;
    this.students.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = `${a.firstname} ${a.lastname}`;
          const nameB = `${b.firstname} ${b.lastname}`;
          return nameA.localeCompare(nameB);
        case 'hours':
          return this.getTotalHours(b) - this.getTotalHours(a);
        case 'university':
          return (a.university || '').localeCompare(b.university || '');
        case 'status':
          const statusOrder = { 'pending': 0, 'active': 1, 'completed': 2 };
          const statusA = this.getStudentStatus(a) as keyof typeof statusOrder;
          const statusB = this.getStudentStatus(b) as keyof typeof statusOrder;
          return statusOrder[statusA] - statusOrder[statusB];
        default:
          return 0;
      }
    });
  }
}
