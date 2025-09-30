import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { I18nService } from '../../shared/i18n.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hour-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe, I18nService],
  templateUrl: './hour-details-modal.component.html',
  styleUrls: ['./hour-details-modal.component.scss']
})
export class HourDetailsModalComponent {
  @Output() approveHour = new EventEmitter<{hourId: number, studentName: string}>();
  emitApproveHour(hourId: number) {
    this.approveHour.emit({ hourId, studentName: `${this.student.firstname} ${this.student.lastname}` });
  }
  @Input() student: any;
  @Input() totalHours: number = 0;
  @Input() approvedHours: number = 0;
  @Input() pendingHours: number = 0;
  @Input() rejectedHours: number = 0;
  @Input() hoursList: any[] = [];
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() rejectHour = new EventEmitter<{hourId: number, studentName: string, reason: string}>();

  get remainingHours(): number {
    return Math.max(0, 180 - this.totalHours);
  }

  handleClose() {
    this.close.emit();
  }

  emitRejectHour(hourId: number) {
    this.rejectHour.emit({ hourId, studentName: `${this.student.firstname} ${this.student.lastname}`, reason: '' });
  }
}

