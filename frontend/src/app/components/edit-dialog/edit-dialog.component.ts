import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogField } from '../../../types';

@Component({
  selector: 'app-edit-dialog',
  imports: [
    FormsModule
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {
  @Input() title = 'Enter information';
  @Input() message = 'Please enter the required information:';
  @Input() fields: DialogField[] = [];
  @Input() formData: Record<string, any> = {};
  @Input() defaultValue = '';
  @Input() placeholder = '';
  @Input() confirmButtonText = 'OK';
  @Input() cancelButtonText = 'Cancel';
  @Input() showDialog = false;

  @Output() confirmed = new EventEmitter<Record<string, any>>();
  @Output() canceled = new EventEmitter<void>();
  @Output() showDialogChange = new EventEmitter<boolean>();

  inputValue = '';

  ngOnChanges() {
    if (this.showDialog) {
      this.inputValue = this.defaultValue;

      setTimeout(() => {
        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
          inputElement.select();
        }
      }, 0);
    }
  }

  onConfirm() {
    this.confirmed.emit(this.formData);
    this.closeDialog();
  }

  onCancel() {
    this.canceled.emit();
    this.closeDialog();
  }

  closeDialog() {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }
  
}
