import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateInternshipHourDTO, InternshipDTO, InternshipHourDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class InternshipHourService {

  http = inject(HttpClient);

  create(hour: CreateInternshipHourDTO) { return this.http.post<CreateInternshipHourDTO>(`/api/internship-hour`, hour); }

  getHours() { return this.http.get<InternshipHourDTO[]>(`/api/internship-hour/mine`); }
}
