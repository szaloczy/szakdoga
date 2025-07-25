import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CompanyDTO, MentorDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  http = inject(HttpClient);
  
  getAll() { return this.http.get<CompanyDTO[]>(`/api/company`)};

  getActive() { return this.http.get<CompanyDTO[]>(`/api/company/active`)};

  search(query: string) { return this.http.get<CompanyDTO[]>(`/api/company/search?q=${query}`)};

  getOne(id: number) { return this.http.get<CompanyDTO>(`/api/company/${id}`)};

  getMentors(id: number) { return this.http.get<MentorDTO[]>(`/api/company/${id}/mentors`)};

  create(company: CompanyDTO) { return this.http.post<CompanyDTO>(`/api/company`, company)};

  update(id: number, company: CompanyDTO) { return this.http.put<CompanyDTO>(`/api/company/${id}`, company)};

  delete(id: number) { return this.http.delete<string>(`/api/company/${id}`)};

  deactivate(id: number) { return this.http.post<any>(`/api/company/${id}/deactivate`, {})};
}
