import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InternshipWithHours, MentorDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class MentorService {

  http = inject(HttpClient);

  getAll() { return this.http.get<MentorDTO[]>(`/api/mentor`)}

  getOne(id: number) { return this.http.get<MentorDTO>("/api/mentor/" + id)};

  getStudents() { return this.http.get<InternshipWithHours[]>(`/api/mentor/students`)};
}
