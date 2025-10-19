import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { I18nService } from "../../shared/i18n.pipe";
import { ToastService } from '../../services/toast.service';
import { RouterLink } from '@angular/router';
import { Document } from '../../../types';

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrl: './document-management.component.scss',
  imports: [CommonModule, I18nService, RouterLink]
})
export class DocumentManagementComponent implements OnInit {
  toastService = inject(ToastService);
  i18nService = inject(I18nService);

  documents: Document[] = [];
  reviewNote = '';
  selectedId: number | null = null;

  constructor(private documentService: DocumentService) {}

  doc: Document = {
    id: 0,
    user: {
      id: 0,
      firstname: '',
      lastname: '',
      email: ''
    },
    filename: '',
    originalName: '',
    status: 'pending',
    uploadedAt: '',
    reviewNote: '',
    name: undefined,
    uploaderName: undefined
  };

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService.getAllDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
      },
      error: (err) => {
        this.toastService.showError(this.i18nService.transform('common_response.admin_panel.document.error_while_loading'));
      }
    });
  }

  acceptDocument(doc: Document) {
    this.documentService.reviewDocument(doc.id, 'approved').subscribe(() => {
      this.toastService.showSuccess(this.i18nService.transform('common_response.admin_panel.document.success_approve'));
      this.loadDocuments();
    });
  }


  rejectDocument(doc: Document) {
    this.documentService.reviewDocument(doc.id, 'rejected', this.reviewNote).subscribe(() => {
      this.toastService.showSuccess(this.i18nService.transform('common_response.admin_panel.document.success_reject'));
      this.loadDocuments();
      this.reviewNote = '';
      this.selectedId = null;
    });
  }

  viewDocument(doc: Document) {
    window.open(`/api/documents/${doc.id}/download`, '_blank');
  }
}
