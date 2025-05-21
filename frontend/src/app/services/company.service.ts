import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CompanyDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  http = inject(HttpClient);
  

  getAll() { return this.http.get<CompanyDTO[]> (`/api/company`)};

  getOne(id: number) { return this.http.get<CompanyDTO> (`/api/company/${id}`)};

  create(company: CompanyDTO) { return this.http.post<string> (`/api/company`, company)};

  update(company: CompanyDTO, id: number) { return this.http.put<string> (`/api/company/${id}`, company)};

  delete(company: CompanyDTO, id: number) { return this.http.delete<string> (`/api/company/${id}`)};
}
