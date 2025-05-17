import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [
    NgClass
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  message: string | null = null;
  toastClass: string = '';

  toastService = inject(ToastService);

  ngOnInit(): void {
    this.toastService.message$.subscribe(({ message, type }) => {
      this.message = message;
      this.toastClass = type;
      setTimeout(() => this.message = null, 3000);
    });
  }
}
