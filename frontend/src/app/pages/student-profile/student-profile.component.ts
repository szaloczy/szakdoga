import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss'
})
export class StudentProfileComponent implements OnInit{
  fb = inject(FormBuilder);
  profileForm!: FormGroup;

  ngOnInit(): void {
    this.profileForm = this.fb.group({

    })
  }

  onSubmit() {}

  onFileSelected(name: any) {}
}
