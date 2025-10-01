import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePictureService {
  private profilePictureSubject = new BehaviorSubject<string | undefined>(undefined);
  
  // Observable for components to subscribe to
  profilePicture$ = this.profilePictureSubject.asObservable();

  // Method to update profile picture
  updateProfilePicture(profilePicture: string | undefined): void {
    this.profilePictureSubject.next(profilePicture);
  }

  // Method to get current value
  getCurrentProfilePicture(): string | undefined {
    return this.profilePictureSubject.value;
  }
}