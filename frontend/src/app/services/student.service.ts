import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StudentDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  http = inject(HttpClient);

  getAll() { return this.http.get<StudentDTO[]>(`/api/student`)};

  getById(id: number) { return this.http.get<StudentDTO>(`/api/student/${id}`)};

  updateProfile(id: number, student: StudentDTO) { return this.http.put<StudentDTO>(`/api/student/${id}`, student)};

  updateProfileByUserId(userId: number, profileData: any) { return this.http.put<any>(`/api/student/user/${userId}`, profileData); }
}
