import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../shared/i18n.pipe';
import { DocumentService } from '../../services/document.service';
import { ToastService } from '../../services/toast.service';
import { UploadedDocument } from '../../../types';

@Component({
  selector: 'app-document-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, I18nService],
  templateUrl: './document-upload-modal.component.html',
  styleUrl: './document-upload-modal.component.scss'
})
export class DocumentUploadModalComponent {
  @Input() show = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() uploadComplete = new EventEmitter<void>();

  documentService = inject(DocumentService);
  toastService = inject(ToastService);
  i18nService = inject(I18nService);

  selectedFile: File | null = null;
  uploadError: string = '';
  uploading: boolean = false;
  documents: UploadedDocument[] = [];
  loadingDocs: boolean = false;

  ngOnChanges() {
    if (this.show) {
      this.loadDocuments();
      this.resetUploadForm();
    }
  }

  close() {
    this.closeModal.emit();
  }

  resetUploadForm() {
    this.selectedFile = null;
    this.uploadError = '';
    this.uploading = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.uploadError = this.i18nService.transform('document_upload.upload_error.error1');
        this.selectedFile = null;
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.uploadError = this.i18nService.transform('document_upload.upload_error.error2');
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
      this.uploadError = '';
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;
    this.uploading = true;
    this.documentService.uploadDocument(this.selectedFile).subscribe({
      next: () => {
        this.uploadError = '';
        this.selectedFile = null;
        this.uploading = false;
        this.toastService.showSuccess(this.i18nService.transform('common_response.document_upload.success_upload'));
        this.loadDocuments();
        this.uploadComplete.emit();
      },
      error: (err) => {
        this.uploadError = this.i18nService.transform('common_response.document_upload.error_upload');
        this.toastService.showError(this.i18nService.transform('common_response.document_upload.error_upload'));
        this.uploading = false;
      }
    });
  }

  loadDocuments() {
    this.loadingDocs = true;
    this.documentService.getStudentDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loadingDocs = false;
      },
      error: () => {
        this.documents = [];
        this.loadingDocs = false;
      }
    });
  }
}
