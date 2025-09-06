import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { I18nService } from "../../shared/i18n.pipe";

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrl: './document-management.component.scss',
  imports: [CommonModule, I18nService]
})
export class DocumentManagementComponent implements OnInit {
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
        console.log(docs);
        this.documents = docs;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  acceptDocument(doc: Document) {
    this.documentService.reviewDocument(doc.id, 'approved').subscribe(() => {
      window.alert('Elfogadva!');
      this.loadDocuments();
    });
  }

  openRejectModal(doc: Document) {
    this.selectedId = doc.id;
    // Modal megnyitása (implementáld Angular Material Dialoggal vagy saját modal komponenssel)
  }

  rejectDocument(doc: Document) {
    this.documentService.reviewDocument(doc.id, 'rejected', this.reviewNote).subscribe(() => {
      window.alert('Elutasítva!');
      this.loadDocuments();
      this.reviewNote = '';
      this.selectedId = null;
      // Modal bezárása
    });
  }

  viewDocument(doc: Document) {
    // Megtekintés logika (pl. modalban vagy új ablakban PDF preview)
    window.open(`/api/documents/${doc.id}/download`, '_blank');
  }
}
