import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateInternshipHourDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class InternshipHourService {

  http = inject(HttpClient);

  create(hour: CreateInternshipHourDTO) { return this.http.post<CreateInternshipHourDTO>(`/api/internship-hour`, hour) }
}
