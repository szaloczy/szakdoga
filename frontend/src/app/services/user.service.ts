import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccessTokenDTO, LoginDTO, RegisterDTO } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  http = inject(HttpClient);

  login(loginData: LoginDTO) {
    return this.http.post<AccessTokenDTO>(`/api/user/login`, loginData);
  }

  register(registerData: RegisterDTO) {
    return this.http.post<string>(`/api/user/register`, registerData);
  }
}
