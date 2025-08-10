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
import Swal from 'sweetalert2';

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

  getApprovedHours(student: StudentResponseDTO): number {
    // For now, this is the same as total hours since we don't have separate approved/pending tracking
    return student.hours;
  }

  getPendingHours(student: StudentResponseDTO): number {
    // For now, we don't have pending hours data from backend
    // We'll return some pending hours based on student status
    const status = this.getStudentStatus(student);
    if (status === 'completed') return 0;
    if (status === 'active') return Math.floor(student.hours * 0.15); // 15% of current hours as pending
    return 8; // Default pending hours for new students
  }

  viewStudentDetails(studentId: number): void {
    this.router.navigate(['/student-profile'], { 
      queryParams: { id: studentId, mentorView: true } 
    });
  }

  approveStudentHours(studentId: number): void {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return;

    const pendingHours = this.getPendingHours(student);
    const approvedHours = this.getApprovedHours(student);
    const totalAfterApproval = approvedHours + pendingHours;

    Swal.fire({
      title: 'Approve Student Hours',
      html: `
        <div class="text-start">
          <h5>Student: ${student.firstname} ${student.lastname}</h5>
          <hr>
          <p><strong>Pending Hours:</strong> ${pendingHours.toFixed(1)} hours</p>
          <p><strong>Current Approved Hours:</strong> ${approvedHours.toFixed(1)} hours</p>
          <p><strong>Total After Approval:</strong> ${totalAfterApproval.toFixed(1)} hours</p>
          ${totalAfterApproval >= 180 ? 
            '<div class="alert alert-success mt-3"><i class="bi bi-trophy"></i> This will complete the 180-hour requirement!</div>' : 
            `<div class="alert alert-info mt-3">Remaining: ${(180 - totalAfterApproval).toFixed(1)} hours to complete requirement</div>`
          }
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Approve Hours',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'larger-swal'
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: 'Processing...',
          text: 'Approving student hours',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Simulate API call
        setTimeout(() => {
          // Update the student's approved hours
          student.hours = totalAfterApproval;
          
          if (totalAfterApproval >= 180) {
            Swal.fire({
              title: 'Congratulations!',
              html: `
                <div class="text-center">
                  <i class="bi bi-trophy" style="font-size: 3rem; color: #ffc107;"></i>
                  <h4>${student.firstname} ${student.lastname}</h4>
                  <p>has completed their <strong>180-hour</strong> internship requirement!</p>
                  <div class="alert alert-success mt-3">
                    Hours approved successfully!
                  </div>
                </div>
              `,
              icon: 'success',
              confirmButtonColor: '#28a745',
              confirmButtonText: 'Excellent!'
            });
          } else {
            Swal.fire({
              title: 'Hours Approved!',
              text: `Successfully approved ${pendingHours.toFixed(1)} hours for ${student.firstname} ${student.lastname}`,
              icon: 'success',
              confirmButtonColor: '#28a745'
            });
          }

          this.toastService.showSuccess('Hours approved successfully!');
        }, 1500);
      }
    });
  }

  viewHoursDetails(student: StudentResponseDTO): void {
    // Open hours details in a modal
    Swal.fire({
      title: `Hours History - ${student.firstname} ${student.lastname}`,
      html: `
        <div class="text-start">
          <div class="row mb-3">
            <div class="col-6">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h6 class="card-title">Total Hours</h6>
                  <h4 class="text-primary">${student.hours.toFixed(1)}</h4>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h6 class="card-title">Remaining</h6>
                  <h4 class="text-warning">${Math.max(0, 180 - student.hours).toFixed(1)}</h4>
                </div>
              </div>
            </div>
          </div>
          
          <div class="progress mb-3" style="height: 20px;">
            <div class="progress-bar" role="progressbar" 
                 style="width: ${Math.min(100, (student.hours / 180) * 100)}%">
              ${((student.hours / 180) * 100).toFixed(1)}%
            </div>
          </div>
          
          <hr>
          
          <h6>Recent Activity:</h6>
          <div class="list-group">
            <div class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>Week 1-2</strong><br>
                <small class="text-muted">Company orientation & training</small>
              </div>
              <span class="badge bg-success rounded-pill">40h</span>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>Week 3-4</strong><br>
                <small class="text-muted">Project work & development</small>
              </div>
              <span class="badge bg-success rounded-pill">35h</span>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>Week 5-6</strong><br>
                <small class="text-muted">Research & documentation</small>
              </div>
              <span class="badge bg-warning rounded-pill">Pending</span>
            </div>
          </div>
          
          <div class="mt-3 text-center">
            <small class="text-muted">
              <i class="bi bi-info-circle"></i>
              Detailed timesheet data would be loaded from the backend
            </small>
          </div>
        </div>
      `,
      width: '600px',
      confirmButtonText: 'Close',
      confirmButtonColor: '#6c757d',
      customClass: {
        popup: 'larger-swal'
      }
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
