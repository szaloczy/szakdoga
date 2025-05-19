import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StudentDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  http = inject(HttpClient);

  getAll() { return this.http.get<StudentDTO[]>("/api/student")};

  getOne(id: number) { return this.http.get<StudentDTO>("/api/student/" + id)};

  create(student: StudentDTO) { return this.http.post<String>("/api/student", student)};

  update(student: StudentDTO) { return this.http.put<String>("/api/student", student)};

  delete(id: number) { return this.http.delete<String>("/api/student/" + id)};
}
