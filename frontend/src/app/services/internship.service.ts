import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InternshipDTO, InternshipListDTO, ProfileInternshipDTO, CreateInternshipDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {

  http = inject(HttpClient);

  getAll() { return this.http.get<InternshipListDTO[]>(`/api/internship`) };

  getOne(id: number) { return this.http.get<InternshipDTO>(`/api/internship/${id}`)};

  getByStudentId(studentId: number) { return this.http.get<ProfileInternshipDTO>(`/api/profile/internship/${studentId}`) };

  create(internship: CreateInternshipDTO) { return this.http.post<InternshipDTO>(`/api/internship`, internship) };

  update(id: number, internship: CreateInternshipDTO) { return this.http.put<InternshipDTO>(`/api/internship/${id}`, internship) };

  delete(id: number) { return this.http.delete<String>(`/api/internship/${id}`) };

  approve(id: number) { return this.http.post<any>(`/api/internship/${id}/approve`, {}) };

  reject(id: number) { return this.http.post<any>(`/api/internship/${id}/reject`, {}) };
}
