import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateInternshipHourDTO, InternshipDTO, InternshipHourDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class InternshipHourService {

  http = inject(HttpClient);

  create(hour: CreateInternshipHourDTO) { return this.http.post<CreateInternshipHourDTO>(`/api/internship-hour`, hour); }

  getHours(status?: 'approved' | 'pending' | 'rejected') {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<InternshipHourDTO[]>(`/api/internship-hour/mine`, {params}); }
}
