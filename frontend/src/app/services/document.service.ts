import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document, DocumentStatus, UploadedDocument } from '../../types';


@Injectable({ providedIn: 'root' })
export class DocumentService {
	constructor(private http: HttpClient) {}

	uploadDocument(file: File): Observable<any> {
		const formData = new FormData();
		formData.append('file', file);
		return this.http.post('/api/documents/upload', formData);
	}

	getStudentDocuments(): Observable<UploadedDocument[]> {
		return this.http.get<UploadedDocument[]>('/api/documents/student');
	}

	getAllDocuments(): Observable<Document[]> {
		return this.http.get<Document[]>('/api/documents');
	}

	reviewDocument(id: number, status: DocumentStatus, reviewNote?: string): Observable<any> {
		return this.http.post(`/api/documents/${id}/review`, { status, reviewNote });
	}

	downloadDocument(id: number): Observable<Blob> {
		return this.http.get(`/api/documents/${id}/download`, { responseType: 'blob' });
	}
}
