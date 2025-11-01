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
  selectedStudentHours: { [studentId: number]: number[] } = {};

  ngOnChanges() {
    if (this.show && this.students.length > 0) {
      this.loadPendingHours();
    }
  }

  loadPendingHours() {
    this.isLoadingPendingHours = true;
    this.studentsWithPendingHours = [];
    this.selectedStudentHours = {};

    const pendingStudents: Array<{student: extendedStudentDTO; pendingHours: InternshipHourDTO[]}> = [];
    let processedCount = 0;

    this.students.forEach(student => {
      this.internshipHourService.getStudentHourDetails(student.id).subscribe({
        next: (details: any) => {
          const pendingHours = (details.hours || []).filter((h: InternshipHourDTO) => h.status === 'pending');
          if (pendingHours.length > 0) {
            pendingStudents.push({ student, pendingHours });
            // Pre-select all pending hours
            this.selectedStudentHours[student.id] = pendingHours.map((h: InternshipHourDTO) => h.id);
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

  toggleHourSelection(studentId: number, hourId: number) {
    if (!this.selectedStudentHours[studentId]) {
      this.selectedStudentHours[studentId] = [];
    }
    
    const index = this.selectedStudentHours[studentId].indexOf(hourId);
    if (index > -1) {
      this.selectedStudentHours[studentId].splice(index, 1);
    } else {
      this.selectedStudentHours[studentId].push(hourId);
    }
  }

  isHourSelected(studentId: number, hourId: number): boolean {
    return this.selectedStudentHours[studentId]?.includes(hourId) || false;
  }

  selectAllHoursForStudent(studentId: number, hours: InternshipHourDTO[]) {
    this.selectedStudentHours[studentId] = hours.map(h => h.id);
  }

  deselectAllHoursForStudent(studentId: number) {
    this.selectedStudentHours[studentId] = [];
  }

  approveSelectedHours() {
    const allSelectedHourIds: number[] = [];
    Object.values(this.selectedStudentHours).forEach(hourIds => {
      allSelectedHourIds.push(...hourIds);
    });

    if (allSelectedHourIds.length === 0) {
      this.toastService.showError(this.i18nService.transform('dashboard.mentor.no_hours_selected'));
      return;
    }

    let approvedCount = 0;
    let errorCount = 0;
    const totalToApprove = allSelectedHourIds.length;

    allSelectedHourIds.forEach(hourId => {
      this.internshipHourService.approveHour(hourId).subscribe({
        next: () => {
          approvedCount++;
          if (approvedCount + errorCount === totalToApprove) {
            this.handleApprovalComplete(approvedCount, errorCount);
          }
        },
        error: () => {
          errorCount++;
          if (approvedCount + errorCount === totalToApprove) {
            this.handleApprovalComplete(approvedCount, errorCount);
          }
        }
      });
    });
  }

  private handleApprovalComplete(approvedCount: number, errorCount: number) {
    if (approvedCount > 0) {
      this.toastService.showSuccess(
        this.i18nService.transform('dashboard.mentor.hours_approved_success', { count: approvedCount.toString() })
      );
    }
    if (errorCount > 0) {
      this.toastService.showError(
        this.i18nService.transform('dashboard.mentor.hours_approved_error', { count: errorCount.toString() })
      );
    }
    
    this.approvalComplete.emit();
    this.close();
  }
}
