import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { I18nService } from '../../shared/i18n.pipe';
import { extendedStudentDTO, InternshipHourDTO } from '../../../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students-list-modal',
  standalone: true,
  imports: [CommonModule, I18nService],
  templateUrl: './students-list-modal.component.html',
  styleUrl: './students-list-modal.component.scss'
})
export class StudentsListModalComponent {
  @Input() show = false;
  @Input() students: extendedStudentDTO[] = [];
  @Input() studentHourStats: { [studentId: number]: { approved: number; pending: number; rejected: number; total: number } } = {};
  @Output() closeModal = new EventEmitter<void>();

  i18nService = inject(I18nService);
  router = inject(Router);

  close() {
    this.closeModal.emit();
  }

  viewStudentProfile(studentId: number) {
    this.router.navigate(['/student-profile', studentId]);
    this.close();
  }

  getStatusBadgeClass(student: extendedStudentDTO): string {
    const stats = this.studentHourStats[student.id];
    if (!stats) return 'bg-secondary';
    
    if (stats.pending > 0) return 'bg-warning';
    if (stats.total > 0) return 'bg-success';
    return 'bg-secondary';
  }

  getStatusText(student: extendedStudentDTO): string {
    const stats = this.studentHourStats[student.id];
    if (!stats) return 'dashboard.mentor.no_activity';
    
    if (stats.pending > 0) return 'dashboard.mentor.pending_approval';
    if (stats.total > 0) return 'dashboard.mentor.up_to_date';
    return 'dashboard.mentor.no_activity';
  }
}
