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
}
