import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-dialog',
  imports: [
    FormsModule
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {
  @Input() title = 'Edit Entity';
  @Input() fields: any[] = []; // array of form field configs
  @Input() data: any = {}; // optional initial data

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  formData: any = {};

  ngOnInit() {
    this.formData = { ...this.data };
  }

  onSubmit() {
    this.save.emit(this.formData);
  }

  onClose() {
    this.close.emit();
  }
}
