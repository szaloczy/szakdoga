
export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface DocumentUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface Document {
name: any;
uploaderName: any;
  id: number;
  user: DocumentUser;
  filename: string;
  originalName: string;
  status: DocumentStatus;
  uploadedAt: string;
  reviewNote?: string;
}

export interface UploadedDocument {
  id: number;
  filename: string;
  originalName: string;
  uploadedAt: string;
  status: DocumentStatus;
  reviewNote?: string;
}
