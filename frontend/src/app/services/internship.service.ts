import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InternshipDTO, InternshipListDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {

  http = inject(HttpClient);

  getAll() { return this.http.get<InternshipListDTO[]>(`/api/internship`) }

  getOne(id: number) { return this.http.get<InternshipDTO>(`/api/internship/${id}`)}

  create(internship: InternshipDTO) { return this.http.post<InternshipDTO>(`/api/internship`, internship) }

  delete(id: number) { return this.http.delete<String>(`/api/internship/${id}`)}
}
