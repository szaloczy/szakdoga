import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccessTokenDTO, LoginDTO, ProfileDTO, RegisterDTO, StudentDTO, UserDTO, UserResponseDto, CreateMentorDTO, CreateStudentDTO } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  http = inject(HttpClient);

  login(loginData: LoginDTO) {
    return this.http.post<AccessTokenDTO>(`/api/user/login`, loginData);
  };

  register(registerData: RegisterDTO) {
    return this.http.post<string>(`/api/user/register`, registerData);
  };

  forgotPassword(email: string): Observable<any> {
    return this.http.post('/api/user/forgot-password', { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post('/api/user/reset-password', { token, password });
  }

  getAll() { return this.http.get<UserResponseDto[]>(`/api/user`)};

  getOne(id: number) { return this.http.get<UserDTO>(`/api/user/${id}`)};

  create(user: CreateMentorDTO | CreateStudentDTO | UserDTO) { return this.http.post<UserDTO>(`/api/user/register`, user)};

  update(id:number, user: UserDTO) { return this.http.put<UserDTO>(`/api/user/${id}`, user)};

  delete(id: number) { return this.http.delete<String>(`/api/user/${id}`)};

  getProfile(id: number) { return this.http.get<ProfileDTO>(`/api/profile/${id}`)};

  updateUser(userId: number, userData: any) { return this.http.put<any>(`/api/user/${userId}`, userData);}

  changePassword(userId: number, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.put(`/api/user/change-password`, { 
      newPassword: newPassword,
      confirmPassword: confirmPassword 
    });
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`/api/user/profile-picture`, formData);
  }

  deleteProfilePicture(): Observable<any> {
    return this.http.delete(`/api/user/profile-picture`);
  }

  getProfilePictureUrl(filename: string): string {
    return `/api/user/profile-picture/${filename}`;
  }
}
