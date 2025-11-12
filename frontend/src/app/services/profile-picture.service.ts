import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePictureService {
  private profilePictureSubject = new BehaviorSubject<string | undefined>(undefined);
  
  profilePicture$ = this.profilePictureSubject.asObservable();

  updateProfilePicture(profilePicture: string | undefined): void {
    this.profilePictureSubject.next(profilePicture);
  }

  getCurrentProfilePicture(): string | undefined {
    return this.profilePictureSubject.value;
  }
}