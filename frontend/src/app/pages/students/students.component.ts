import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '../../shared/i18n.pipe';
import { HourDetailsModalComponent } from '../../components/hour-details-modal/hour-details-modal.component';
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
  hours: number; // Total approved hours
  pendingHours?: number; // Pending hours awaiting approval
  rejectedHours?: number; // Rejected hours
  totalSubmittedHours?: number; // Total hours ever submitted
}

@Component({
  selector: 'app-students',
  imports: [
    CommonModule,
    FormsModule,
    I18nService,
    HourDetailsModalComponent
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {

  private mentorService = inject(MentorService);
  i18nService = inject(I18nService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private internshipHourService = inject(InternshipHourService);

  students: StudentResponseDTO[] = [];
  isLoading = false;
  searchTerm = '';
  selectedFilter = 'all'; 
  sortBy = 'name'; 

  private REFRESH_AFTER_APPROVAL = false;

  showHourDetailsModal: boolean = false;
  modalStudent: StudentResponseDTO | null = null;
  modalTotalHours: number = 0;
  modalApprovedHours: number = 0;
  modalPendingHours: number = 0;
  modalRejectedHours: number = 0;
  modalHoursList: any[] = [];

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
        console.log('Backend response:', data);
        
        if (Array.isArray(data)) {
          this.students = data as StudentResponseDTO[];
        } else if (data && Array.isArray(data.students)) {
          this.students = data.students as StudentResponseDTO[];
        } else if (data && Array.isArray(data.data)) {
          this.students = data.data as StudentResponseDTO[];
        } else {
          console.error('Unexpected response format:', data);
          this.students = [];
          this.toastService.showError('Invalid data format received from server');
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.toastService.showError('Failed to load students');
        this.students = [];
        this.isLoading = false;
      }
    });
  }

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
    return student.hours;
  }

  getPendingHours(student: StudentResponseDTO): number {
    return student.pendingHours || 0;
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
      title: this.i18nService.transform('students.pop_ups.approval.title'),
      html: `
        <div class="text-start">
          <h5>${this.i18nService.transform('students.pop_ups.approval.student_label')} ${student.firstname} ${student.lastname}</h5>
          <hr>
          <p><strong>${this.i18nService.transform('students.pop_ups.approval.pending_hours')}</strong> ${pendingHours.toFixed(1)}</p>
          <p><strong>${this.i18nService.transform('students.pop_ups.approval.current_approved_hours')}</strong> ${approvedHours.toFixed(1)}</p>
          <p><strong>${this.i18nService.transform('students.pop_ups.approval.total_after_approval')}</strong> ${totalAfterApproval.toFixed(1)}</p>
          ${totalAfterApproval >= 180 ? 
            `<div class="alert alert-success mt-3"><i class="bi bi-trophy"></i> ${this.i18nService.transform('students.pop_ups.approval.complete_requirement')}</div>` : 
            `<div class="alert alert-info mt-3">${this.i18nService.transform('students.pop_ups.approval.remaining_hours', { hours: (180 - totalAfterApproval).toFixed(1) })}</div>`
          }
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.i18nService.transform('students.pop_ups.approval.confirm_button'),
      cancelButtonText: this.i18nService.transform('buttons.forms.cancel'),
      customClass: {
        popup: 'larger-swal'
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: this.i18nService.transform('students.pop_ups.approval.processing_title'),
          text: this.i18nService.transform('students.pop_ups.approval.processing_desc'),
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });


        this.internshipHourService.approveAllStudentHours(studentId).subscribe({
          next: (response) => {
            console.log('Hours approved successfully:', response);
            
            const studentIndex = this.students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
              if (response && response.newTotalHours !== undefined) {
                this.students[studentIndex] = {
                  ...this.students[studentIndex],
                  hours: response.newTotalHours,
                  pendingHours: 0
                };
              } else {
                this.students[studentIndex] = {
                  ...this.students[studentIndex],
                  hours: totalAfterApproval,
                  pendingHours: 0
                };
              }
            }
            
            if (totalAfterApproval >= 180) {
              Swal.fire({
                title: this.i18nService.transform('students.pop_ups.approval.success_title'),
                html: `
                  <div class="text-center">
                    <i class="bi bi-trophy" style="font-size: 3rem; color: #ffc107;"></i>
                    <h4>${student.firstname} ${student.lastname}</h4>
                    <p>${this.i18nService.transform('students.pop_ups.approval.success_desc')}</p>
                    <div class="alert alert-success mt-3">
                      ${this.i18nService.transform('students.pop_ups.approval.success_message')}
                    </div>
                  </div>
                `,
                icon: 'success',
                confirmButtonColor: '#28a745',
                confirmButtonText: this.i18nService.transform('students.pop_ups.approval.excellent_button')
              });
            } else {
              Swal.fire({
                title: this.i18nService.transform('students.pop_ups.approval.hours_approved_title'),
                text: this.i18nService.transform('students.pop_ups.approval.hours_approved_desc', { name: `${student.firstname} ${student.lastname}` }),
                icon: 'success',
                confirmButtonColor: '#28a745'
              });
            }

            this.toastService.showSuccess(this.i18nService.transform('students.pop_ups.approval.success_message'));
            
            if (this.REFRESH_AFTER_APPROVAL) {
              this.loadStudents();
            }
          },
          error: (error) => {
            console.error('Error approving hours:', error);
            Swal.fire({
              title: this.i18nService.transform('students.pop_ups.approval.error_title'),
              text: this.i18nService.transform('students.pop_ups.approval.error_desc'),
              icon: 'error',
              confirmButtonColor: '#dc3545'
            });
            this.toastService.showError(this.i18nService.transform('students.pop_ups.approval.error_desc'));
          }
        });
      }
    });
  }

  

  rejectStudentHours(studentId: number): void {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return;

    const pendingHours = this.getPendingHours(student);
    if (pendingHours === 0) {
      this.toastService.showError('Nincs elutasítható függő óra!');
      return;
    }

    Swal.fire({
      title: this.i18nService.transform('students.pop_ups.rejection.title'),
      html: this.i18nService.transform('students.pop_ups.rejection.desc1', { firstname: student.firstname, lastname: student.lastname }) + this.i18nService.transform('students.pop_ups.rejection.desc2'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.i18nService.transform('buttons.forms.reject'),
      cancelButtonText:  this.i18nService.transform('buttons.forms.cancel'),
      customClass: { popup: 'larger-swal' }
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: this.i18nService.transform('students.pop_ups.rejection.loading'),
          text: this.i18nService.transform('students.pop_ups.rejection.loading_desc'),
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => { Swal.showLoading(); }
        });

        this.internshipHourService.rejectAllStudentHours(studentId).subscribe({
          next: (response: any) => {
            const studentIndex = this.students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
              this.students[studentIndex] = {
                ...this.students[studentIndex],
                pendingHours: 0,
                rejectedHours: (this.students[studentIndex].rejectedHours || 0) + pendingHours
              };
            }
            Swal.fire({
              title: 'Elutasítva!',
              text: `Sikeresen elutasítottad ${student.firstname} összes függőben lévő óráját!`,
              icon: 'success',
              confirmButtonColor: '#28a745'
            });
            this.toastService.showSuccess('Hallgató órái elutasítva!');
            if (this.REFRESH_AFTER_APPROVAL) {
              this.loadStudents();
            }
          },
          error: (error: any) => {
            console.error('Error rejecting hours:', error);
            Swal.fire({
              title: 'Hiba!',
              text: 'Az órák elutasítása nem sikerült. Próbáld újra!',
              icon: 'error',
              confirmButtonColor: '#dc3545'
            });
            this.toastService.showError('Az órák elutasítása nem sikerült');
          }
        });
      }
    });
  }

  viewHoursDetails(student: StudentResponseDTO): void {
    this.internshipHourService.getStudentHourDetails(student.id).subscribe({
      next: (response: any) => {
        const data = response.data || response;
        this.modalStudent = student;
        this.modalTotalHours = data.totalHours || student.hours;
        this.modalApprovedHours = data.approvedHours || student.hours;
        this.modalPendingHours = data.pendingHours || this.getPendingHours(student);
        this.modalRejectedHours = data.rejectedHours || 0;
        this.modalHoursList = data.hours || [];
        this.showHourDetailsModal = true;
      },
      error: (error: any) => {
        console.error('Error fetching hour details:', error);
        this.toastService.showError('Nem sikerült lekérni az óra adatokat');
      }
    });
  }

  handleHourDetailsModalClose(): void {
    this.showHourDetailsModal = false;
    this.modalStudent = null;
    this.modalHoursList = [];
  }

  handleRejectHourFromModal(event: { hourId: number, studentName: string, reason: string }): void {
    this.internshipHourService.rejectHour(event.hourId, event.reason).subscribe({
      next: () => {
        this.toastService.showSuccess('Óra elutasítva!');
        this.handleHourDetailsModalClose();
        if (this.REFRESH_AFTER_APPROVAL) {
          this.loadStudents();
        }
      },
      error: (error: any) => {
        this.toastService.showError('Az óra elutasítása nem sikerült');
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
    const studentsWithPending = this.students.filter(s => this.getPendingHours(s) > 0);
    
    if (studentsWithPending.length === 0) {
      this.toastService.showError('No students have pending hours to approve');
      return;
    }

    Swal.fire({
      title: 'Bulk Approve All Pending Hours',
      html: `
        <div class="text-start">
          <p>This will approve all pending hours for the following students:</p>
          <ul class="list-unstyled">
            ${studentsWithPending.map(s => `
              <li class="mb-2">
                <strong>${s.firstname} ${s.lastname}</strong><br>
                <small class="text-muted">Pending: ${this.getPendingHours(s).toFixed(1)} hours</small>
              </li>
            `).join('')}
          </ul>
          <div class="alert alert-warning mt-3">
            <i class="bi bi-exclamation-triangle"></i>
            This action cannot be undone!
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Approve All (${studentsWithPending.length} students)`,
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'larger-swal'
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.performBulkApproval(studentsWithPending);
      }
    });
  }

  private performBulkApproval(students: StudentResponseDTO[]): void {
    Swal.fire({
      title: 'Processing...',
      text: `Approving hours for ${students.length} students`,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    let processedCount = 0;
    const errors: string[] = [];

    const processNext = (index: number) => {
      if (index >= students.length) {
        this.handleBulkApprovalComplete(processedCount, errors);
        return;
      }

      const student = students[index];
      this.internshipHourService.approveAllStudentHours(student.id).subscribe({
        next: (response: any) => {
          console.log(`Approved hours for ${student.firstname} ${student.lastname}:`, response);
          
          const studentIndex = this.students.findIndex(s => s.id === student.id);
          if (studentIndex !== -1) {
            const pendingHours = this.getPendingHours(student);
            this.students[studentIndex] = {
              ...this.students[studentIndex],
              hours: this.students[studentIndex].hours + pendingHours,
              pendingHours: 0
            };
          }
          
          processedCount++;
          processNext(index + 1);
        },
        error: (error: any) => {
          console.error(`Error approving hours for ${student.firstname} ${student.lastname}:`, error);
          errors.push(`${student.firstname} ${student.lastname}: ${error.message || 'Unknown error'}`);
          processNext(index + 1);
        }
      });
    };

    processNext(0);
  }

  private handleBulkApprovalComplete(successCount: number, errors: string[]): void {
    if (errors.length === 0) {
      Swal.fire({
        title: 'Bulk Approval Complete!',
        text: `Successfully approved hours for ${successCount} students`,
        icon: 'success',
        confirmButtonColor: '#28a745'
      });
      this.toastService.showSuccess(`Bulk approval complete: ${successCount} students processed`);
      
      if (this.REFRESH_AFTER_APPROVAL) {
        this.loadStudents();
      }
    } else {
      Swal.fire({
        title: 'Bulk Approval Complete with Errors',
        html: `
          <div class="text-start">
            <p><strong>Successfully processed:</strong> ${successCount} students</p>
            <p><strong>Errors:</strong> ${errors.length}</p>
            <hr>
            <h6>Error Details:</h6>
            <div class="alert alert-danger">
              ${errors.map(error => `<small>${error}</small>`).join('<br>')}
            </div>
          </div>
        `,
        icon: 'warning',
        confirmButtonColor: '#ffc107'
      });
      this.toastService.showError(`Bulk approval completed with ${errors.length} errors`);
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

  handleApproveHourFromModal(event: { hourId: number, studentName: string }): void {
    this.internshipHourService.approveHour(event.hourId).subscribe({
      next: () => {
        this.toastService.showSuccess('Óra elfogadva!');
        this.handleHourDetailsModalClose();
        if (this.REFRESH_AFTER_APPROVAL) {
          this.loadStudents();
        }
      },
      error: (error: any) => {
        this.toastService.showError('Az óra elfogadása nem sikerült');
      }
    });
  }
}
