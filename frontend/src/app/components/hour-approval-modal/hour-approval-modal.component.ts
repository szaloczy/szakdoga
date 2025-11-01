import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { I18nService } from '../../shared/i18n.pipe';
import { InternshipHourDTO, extendedStudentDTO } from '../../../types';
import { InternshipHourService } from '../../services/internship-hour.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-hour-approval-modal',
  standalone: true,
  imports: [CommonModule, I18nService],
  templateUrl: './hour-approval-modal.component.html',
  styleUrl: './hour-approval-modal.component.scss'
})
export class HourApprovalModalComponent {
  @Input() show = false;
  @Input() students: extendedStudentDTO[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() approvalComplete = new EventEmitter<void>();

  internshipHourService = inject(InternshipHourService);
  toastService = inject(ToastService);
  i18nService = inject(I18nService);

  studentsWithPendingHours: Array<{
    student: extendedStudentDTO;
    pendingHours: InternshipHourDTO[];
  }> = [];
  isLoadingPendingHours = false;
  processingStudents: { [studentId: number]: boolean } = {};

  ngOnChanges() {
    if (this.show && this.students.length > 0) {
      this.loadPendingHours();
    }
  }

  loadPendingHours() {
    this.isLoadingPendingHours = true;
    this.studentsWithPendingHours = [];

    const pendingStudents: Array<{student: extendedStudentDTO; pendingHours: InternshipHourDTO[]}> = [];
    let processedCount = 0;

    this.students.forEach(student => {
      this.internshipHourService.getStudentHourDetails(student.id).subscribe({
        next: (details: any) => {
          const pendingHours = (details.hours || []).filter((h: InternshipHourDTO) => h.status === 'pending');
          if (pendingHours.length > 0) {
            pendingStudents.push({ student, pendingHours });
          }
          processedCount++;
          if (processedCount === this.students.length) {
            this.studentsWithPendingHours = pendingStudents;
            this.isLoadingPendingHours = false;
          }
        },
        error: () => {
          processedCount++;
          if (processedCount === this.students.length) {
            this.studentsWithPendingHours = pendingStudents;
            this.isLoadingPendingHours = false;
          }
        }
      });
    });
  }

  close() {
    this.closeModal.emit();
  }

  approveAllForStudent(studentId: number, hours: InternshipHourDTO[]) {
    this.processingStudents[studentId] = true;
    let approvedCount = 0;
    let errorCount = 0;
    const totalToApprove = hours.length;

    hours.forEach(hour => {
      this.internshipHourService.approveHour(hour.id).subscribe({
        next: () => {
          approvedCount++;
          if (approvedCount + errorCount === totalToApprove) {
            this.handleStudentApprovalComplete(studentId, approvedCount, errorCount);
          }
        },
        error: () => {
          errorCount++;
          if (approvedCount + errorCount === totalToApprove) {
            this.handleStudentApprovalComplete(studentId, approvedCount, errorCount);
          }
        }
      });
    });
  }

  rejectAllForStudent(studentId: number, hours: InternshipHourDTO[]) {
    this.processingStudents[studentId] = true;
    let rejectedCount = 0;
    let errorCount = 0;
    const totalToReject = hours.length;

    hours.forEach(hour => {
      this.internshipHourService.rejectHour(hour.id).subscribe({
        next: () => {
          rejectedCount++;
          if (rejectedCount + errorCount === totalToReject) {
            this.handleStudentRejectionComplete(studentId, rejectedCount, errorCount);
          }
        },
        error: () => {
          errorCount++;
          if (rejectedCount + errorCount === totalToReject) {
            this.handleStudentRejectionComplete(studentId, rejectedCount, errorCount);
          }
        }
      });
    });
  }

  private handleStudentApprovalComplete(studentId: number, approvedCount: number, errorCount: number) {
    this.processingStudents[studentId] = false;
    
    if (approvedCount > 0) {
      this.toastService.showSuccess(
        this.i18nService.transform('dashboard.mentor.hours_approved_success')
      );
    }
    if (errorCount > 0) {
      this.toastService.showError(
        this.i18nService.transform('dashboard.mentor.hours_approved_error')
      );
    }

    this.studentsWithPendingHours = this.studentsWithPendingHours.filter(s => s.student.id !== studentId);
    
    if (this.studentsWithPendingHours.length === 0) {
      this.approvalComplete.emit();
      this.close();
    } else {
      this.approvalComplete.emit();
    }
  }

  private handleStudentRejectionComplete(studentId: number, rejectedCount: number, errorCount: number) {
    this.processingStudents[studentId] = false;
    
    if (rejectedCount > 0) {
      this.toastService.showSuccess(
        this.i18nService.transform('dashboard.mentor.hours_rejected_success')
      );
    }
    if (errorCount > 0) {
      this.toastService.showError(
        this.i18nService.transform('dashboard.mentor.hours_rejected_error')
      );
    }

    this.studentsWithPendingHours = this.studentsWithPendingHours.filter(s => s.student.id !== studentId);

    if (this.studentsWithPendingHours.length === 0) {
      this.approvalComplete.emit();
      this.close();
    } else {
      this.approvalComplete.emit();
    }
  }
}
