import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateInternshipHourDTO, InternshipDTO, InternshipHourDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class InternshipHourService {

  http = inject(HttpClient);

  getAll() { return this.http.get<InternshipHourDTO[]>(`/api/internship-hour`) };

  getMine(status?: 'approved' | 'pending' | 'rejected') {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<InternshipHourDTO[]>(`/api/internship-hour/mine`, {params})
  };

  getOne(id: number) { return this.http.get<InternshipHourDTO>(`/api/internship-hour/${id}`) };

  create(hour: CreateInternshipHourDTO) { return this.http.post<CreateInternshipHourDTO>(`/api/internship-hour`, hour) };

  update(id: number, hour: InternshipHourDTO) { return this.http.put<InternshipHourDTO>(`/api/internship-hour/${id}`, hour) };

  delete(id: number) { return this.http.delete<any>(`/api/internship-hour/${id}`) };

  // New methods for mentor functionality
  approveHour(id: number) { 
    return this.http.post<any>(`/api/internship-hour/${id}/approve`, {}) 
  };

  rejectHour(id: number, reason?: string) { 
    return this.http.post<any>(`/api/internship-hour/${id}/reject`, { reason }) 
  };

  rejectAllStudentHours(studentId: number) {
    return this.http.post<any>(`/api/internship-hour/student/${studentId}/reject-all`, {})
  }

  bulkApprove(hourIds: number[]) {
    return this.http.post<any>(`/api/internship-hour/bulk-approve`, { hourIds })
  };

  approveAllStudentHours(studentId: number) {
    return this.http.post<any>(`/api/internship-hour/student/${studentId}/approve-all`, {})
  };

  getStudentHourDetails(studentId: number) {
    return this.http.get<any>(`/api/internship-hour/student/${studentId}/details`)
  };
}
