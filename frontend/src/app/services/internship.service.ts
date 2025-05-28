import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InternshipDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {

  http = inject(HttpClient);

  getAll() { return this.http.get<InternshipDTO[]>(`/api/internship`) }

  getOne(id: number) { return this.http.get<InternshipDTO>(`/api/internship/${id}`)}
}
