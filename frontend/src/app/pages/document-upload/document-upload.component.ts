import { Component } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { UploadedDocument } from '../../models/document.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-document-upload',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
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

  constructor(private documentService: DocumentService) {
    this.loadDocuments();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.uploadError = 'Csak PDF fájl tölthető fel!';
        this.selectedFile = null;
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.uploadError = 'A fájl mérete maximum 10MB lehet!';
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
        this.uploadError = 'Hiba történt a feltöltés során.';
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
