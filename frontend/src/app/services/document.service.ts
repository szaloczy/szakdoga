import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadedDocument {
	id: number;
	filename: string;
	originalName: string;
	uploadedAt: string;
	status: 'pending' | 'approved' | 'rejected';
	reviewNote?: string;
}

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
}
