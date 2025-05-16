import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageSubject = new Subject<{message: string, type: 'error' | 'success'}>();
  message$ = this.messageSubject.asObservable();

  showError(message: string) {
    this.messageSubject.next({ message, type: 'error'});
  }

  showSuccess(message: string) {
    this.messageSubject.next({ message, type: 'success'});
  }
}
