import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InternshipWithHours, MentorDTO, CreateMentorDTO, UpdateMentorDTO, MentorProfileDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class MentorService {

  http = inject(HttpClient);

  getAll() { return this.http.get<MentorDTO[]>(`/api/mentor`)};

  getById(id: number) { return this.http.get<MentorDTO>(`/api/mentor/${id}`)};

  getByUserId(id: number) { return this.http.get<MentorProfileDTO>(`/api/mentor/user/${id}`)};

  create(mentor: CreateMentorDTO) { return this.http.post<MentorDTO>(`/api/mentor`, mentor)};

  updateProfile(id: number, mentor: UpdateMentorDTO) { return this.http.put<MentorDTO>(`/api/mentor/${id}`, mentor)};

  deactivate(id: number) { return this.http.delete<any>(`/api/mentor/${id}`)};

  getStudents() { return this.http.get<any>(`/api/mentor/students`)};  // Returns StudentResponseDTO[]

  getByCompany(companyId: number) { return this.http.get<MentorDTO[]>(`/api/mentor/company/${companyId}`)};

  search(query: string) { return this.http.get<MentorDTO[]>(`/api/mentor/search?q=${query}`)};
}
