import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccessTokenDTO, LoginDTO, ProfileDTO, RegisterDTO, StudentDTO, UserDTO, UserResponseDto } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  http = inject(HttpClient);

  login(loginData: LoginDTO) {
    return this.http.post<AccessTokenDTO>(`api/user/login`, loginData);
  }

  register(registerData: RegisterDTO) {
    return this.http.post<string>(`/api/user/register`, registerData);
  }

  getAll() { return this.http.get<UserResponseDto[]>(`/api/user`)};

  getOne(id: number) { return this.http.get<UserDTO>(`/api/user/` + id)};

  create(user: UserDTO) { return this.http.post<UserDTO>(`/api/user/register`, user)};

  update(id:number, user: UserDTO) { return this.http.put<UserDTO>(`/api/user/${id}`, user)}

  delete(id: number) { return this.http.delete<String>(`/api/user/${id}`)};

  getProfile(id: number) { return this.http.get<ProfileDTO>(`/api/profile/` + id)};

  updateProfile(id: number,profile: ProfileDTO) { return this.http.put<string>(`/api/profile/` + id, profile)};
}
