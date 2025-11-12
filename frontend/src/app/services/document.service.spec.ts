import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';
import { Document, DocumentStatus, UploadedDocument } from '../../types';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;

  const mockUploadedDocuments: UploadedDocument[] = [
    {
      id: 1,
      filename: 'document1.pdf',
      originalName: 'My Document 1.pdf',
      uploadedAt: '2024-01-01T10:00:00Z',
      status: 'approved'
    },
    {
      id: 2,
      filename: 'document2.pdf',
      originalName: 'My Document 2.pdf',
      uploadedAt: '2024-01-02T10:00:00Z',
      status: 'pending'
    }
  ];

  const mockDocuments: Document[] = [
    {
      id: 1,
      filename: 'document1.pdf',
      originalName: 'Student Document 1.pdf',
      uploadedAt: '2024-01-01T10:00:00Z',
      status: 'approved',
      name: 'Student Document 1.pdf',
      uploaderName: 'John Doe',
      user: {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com'
      }
    },
    {
      id: 2,
      filename: 'document2.pdf',
      originalName: 'Student Document 2.pdf',
      uploadedAt: '2024-01-02T10:00:00Z',
      status: 'pending',
      name: 'Student Document 2.pdf',
      uploaderName: 'Jane Smith',
      user: {
        id: 2,
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane@example.com'
      }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService]
    });
    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('uploadDocument', () => {
    it('should upload a file successfully', () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const mockResponse = { success: true, message: 'File uploaded' };

      service.uploadDocument(mockFile).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/documents/upload');
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      expect(req.request.body.get('file')).toBe(mockFile);
      req.flush(mockResponse);
    });

    it('should handle upload error', () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const errorMessage = 'Upload failed';

      service.uploadDocument(mockFile).subscribe(
        () => fail('should have failed'),
        error => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        }
      );

      const req = httpMock.expectOne('/api/documents/upload');
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getStudentDocuments', () => {
    it('should retrieve student documents', () => {
      service.getStudentDocuments().subscribe(documents => {
        expect(documents).toEqual(mockUploadedDocuments);
        expect(documents.length).toBe(2);
      });

      const req = httpMock.expectOne('/api/documents/student');
      expect(req.request.method).toBe('GET');
      req.flush(mockUploadedDocuments);
    });

    it('should handle error when retrieving student documents', () => {
      const errorMessage = 'Failed to fetch documents';

      service.getStudentDocuments().subscribe(
        () => fail('should have failed'),
        error => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        }
      );

      const req = httpMock.expectOne('/api/documents/student');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getAllDocuments', () => {
    it('should retrieve all documents', () => {
      service.getAllDocuments().subscribe(documents => {
        expect(documents).toEqual(mockDocuments);
        expect(documents.length).toBe(2);
      });

      const req = httpMock.expectOne('/api/documents');
      expect(req.request.method).toBe('GET');
      req.flush(mockDocuments);
    });

    it('should handle error when retrieving all documents', () => {
      const errorMessage = 'Failed to fetch all documents';

      service.getAllDocuments().subscribe(
        () => fail('should have failed'),
        error => {
          expect(error.status).toBe(403);
          expect(error.error).toBe(errorMessage);
        }
      );

      const req = httpMock.expectOne('/api/documents');
      req.flush(errorMessage, { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('reviewDocument', () => {
    it('should review document with status only', () => {
      const documentId = 1;
      const status: DocumentStatus = 'approved';
      const mockResponse = { success: true };

      service.reviewDocument(documentId, status).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`/api/documents/${documentId}/review`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ status, reviewNote: undefined });
      req.flush(mockResponse);
    });

    it('should review document with status and review note', () => {
      const documentId = 2;
      const status: DocumentStatus = 'rejected';
      const reviewNote = 'Document is incomplete';
      const mockResponse = { success: true };

      service.reviewDocument(documentId, status, reviewNote).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`/api/documents/${documentId}/review`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ status, reviewNote });
      req.flush(mockResponse);
    });

    it('should handle review error', () => {
      const documentId = 1;
      const status: DocumentStatus = 'approved';
      const errorMessage = 'Review failed';

      service.reviewDocument(documentId, status).subscribe(
        () => fail('should have failed'),
        error => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        }
      );

      const req = httpMock.expectOne(`/api/documents/${documentId}/review`);
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('downloadDocument', () => {
    it('should download document as blob', () => {
      const documentId = 1;
      const mockBlob = new Blob(['file content'], { type: 'application/pdf' });

      service.downloadDocument(documentId).subscribe(blob => {
        expect(blob).toBeTruthy();
        expect(blob.type).toBe('application/pdf');
      });

      const req = httpMock.expectOne(`/api/documents/${documentId}/download`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(mockBlob);
    });

    it('should handle download error', () => {
      const documentId = 1;
      const errorMessage = 'Download failed';

      service.downloadDocument(documentId).subscribe(
        () => fail('should have failed'),
        error => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`/api/documents/${documentId}/download`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });
});
