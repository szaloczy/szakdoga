import { Component } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { UploadedDocument } from '../../models/document.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { I18nService } from "../../shared/i18n.pipe";


@Component({
  selector: 'app-document-upload',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, I18nService],
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent {
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: string = '';
  uploading: boolean = false;
  documents: UploadedDocument[] = [];
  loadingDocs: boolean = false;

  constructor(private documentService: DocumentService, private i18n: I18nService) {
    this.loadDocuments();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.uploadError = this.i18n.transform('document_upload.upload_error.error1');
        this.selectedFile = null;
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.uploadError = this.i18n.transform('document_upload.upload_error.error2');
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
        this.uploadSuccess = true;
        this.uploadError = '';
        this.selectedFile = null;
        this.uploading = false;
        this.loadDocuments();
      },
      error: (err) => {
        this.uploadError = this.i18n.transform('document_upload.upload_error.error3');
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
