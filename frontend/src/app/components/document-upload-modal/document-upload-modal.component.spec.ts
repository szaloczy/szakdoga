import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { DocumentUploadModalComponent } from './document-upload-modal.component';
import { DocumentService } from '../../services/document.service';
import { ToastService } from '../../services/toast.service';
import { I18nService } from '../../shared/i18n.pipe';
import { UploadedDocument } from '../../../types';

describe('DocumentUploadModalComponent', () => {
  let component: DocumentUploadModalComponent;
  let fixture: ComponentFixture<DocumentUploadModalComponent>;
  let mockDocumentService: jasmine.SpyObj<DocumentService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockI18nService: jasmine.SpyObj<I18nService>;

  const mockDocuments: UploadedDocument[] = [
    { id: 1, filename: 'document1.pdf', originalName: 'My Document 1.pdf', uploadedAt: '2024-01-01', status: 'approved' },
    { id: 2, filename: 'document2.pdf', originalName: 'My Document 2.pdf', uploadedAt: '2024-01-02', status: 'pending' }
  ];

  beforeEach(async () => {
    mockDocumentService = jasmine.createSpyObj('DocumentService', ['uploadDocument', 'getStudentDocuments']);
    mockToastService = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);
    mockI18nService = jasmine.createSpyObj('I18nService', ['transform']);

    await TestBed.configureTestingModule({
      imports: [DocumentUploadModalComponent, FormsModule],
      providers: [
        { provide: DocumentService, useValue: mockDocumentService },
        { provide: ToastService, useValue: mockToastService },
        { provide: I18nService, useValue: mockI18nService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentUploadModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should load documents and reset form when show is true', () => {
      mockDocumentService.getStudentDocuments.and.returnValue(of(mockDocuments));
      spyOn(component, 'loadDocuments');
      spyOn(component, 'resetUploadForm');

      component.show = true;
      component.ngOnChanges();

      expect(component.loadDocuments).toHaveBeenCalled();
      expect(component.resetUploadForm).toHaveBeenCalled();
    });

    it('should not load documents when show is false', () => {
      spyOn(component, 'loadDocuments');
      spyOn(component, 'resetUploadForm');

      component.show = false;
      component.ngOnChanges();

      expect(component.loadDocuments).not.toHaveBeenCalled();
      expect(component.resetUploadForm).not.toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should emit closeModal event', () => {
      spyOn(component.closeModal, 'emit');

      component.close();

      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  describe('resetUploadForm', () => {
    it('should reset form fields', () => {
      component.selectedFile = new File([''], 'test.pdf');
      component.uploadError = 'Some error';
      component.uploading = true;

      component.resetUploadForm();

      expect(component.selectedFile).toBeNull();
      expect(component.uploadError).toBe('');
      expect(component.uploading).toBe(false);
    });
  });

  describe('onFileSelected', () => {
    it('should set selected file when valid PDF is chosen', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const event = { target: { files: [file] } } as any;

      component.onFileSelected(event);

      expect(component.selectedFile).toBe(file);
      expect(component.uploadError).toBe('');
    });

    it('should show error when file is not PDF', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const event = { target: { files: [file] } } as any;
      mockI18nService.transform.and.returnValue('Only PDF files are allowed');

      component.onFileSelected(event);

      expect(component.selectedFile).toBeNull();
      expect(component.uploadError).toBe('Only PDF files are allowed');
    });

    it('should show error when file is too large', () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });
      const event = { target: { files: [largeFile] } } as any;
      mockI18nService.transform.and.returnValue('File is too large');

      component.onFileSelected(event);

      expect(component.selectedFile).toBeNull();
      expect(component.uploadError).toBe('File is too large');
    });
  });

  describe('uploadFile', () => {
    it('should upload file successfully', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      component.selectedFile = file;
      mockDocumentService.uploadDocument.and.returnValue(of({}));
      mockDocumentService.getStudentDocuments.and.returnValue(of(mockDocuments));
      mockI18nService.transform.and.returnValue('Upload successful');
      spyOn(component.uploadComplete, 'emit');

      component.uploadFile();

      expect(mockDocumentService.uploadDocument).toHaveBeenCalledWith(file);
      expect(mockToastService.showSuccess).toHaveBeenCalledWith('Upload successful');
      expect(component.uploading).toBe(false);
      expect(component.selectedFile).toBeNull();
      expect(component.uploadComplete.emit).toHaveBeenCalled();
    });

    it('should handle upload error', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      component.selectedFile = file;
      const error = new Error('Upload failed');
      mockDocumentService.uploadDocument.and.returnValue(throwError(() => error));
      mockI18nService.transform.and.returnValue('Upload error');

      component.uploadFile();

      expect(mockToastService.showError).toHaveBeenCalledWith('Upload error');
      expect(component.uploading).toBe(false);
      expect(component.uploadError).toBe('Upload error');
    });

    it('should not upload if no file is selected', () => {
      component.selectedFile = null;

      component.uploadFile();

      expect(mockDocumentService.uploadDocument).not.toHaveBeenCalled();
    });
  });

  describe('loadDocuments', () => {
    it('should load documents successfully', () => {
      mockDocumentService.getStudentDocuments.and.returnValue(of(mockDocuments));

      component.loadDocuments();

      expect(component.loadingDocs).toBe(false);
      expect(component.documents).toEqual(mockDocuments);
    });

    it('should handle error when loading documents', () => {
      const error = new Error('Failed to load');
      mockDocumentService.getStudentDocuments.and.returnValue(throwError(() => error));

      component.loadDocuments();

      expect(component.loadingDocs).toBe(false);
      expect(component.documents).toEqual([]);
    });
  });
});
