import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileDTO, StudentDTO, UserRole } from '../../../types';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss'
})
export class StudentProfileComponent implements OnInit{

  userService = inject(UserService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  profileForm!: FormGroup;
  companyForm!: FormGroup;

  profile: ProfileDTO = {
    id: 0,
    email: '',
    firstname: '',
    lastname: '',
    role: UserRole.STUDENT,
    student: undefined
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstname: [, []],
      lastname: ['', []],
      phone: ['', []],
      email: ['', []],
      university: ['', []],
      major: ['', []],
    });

    this.companyForm = this.fb.group({
      company: ['', []],
      mentor: ['', []],
      phone: ['', []],
      email: ['',[]],
      city: ['', []],
      address: ['', []]
    });

    this.userService.getProfile(this.authService.getUserId()).subscribe({
      next: (profileData) => {
        this.profile = profileData;
        this.profileForm.patchValue({
          email: this.profile.email,
          firstname: this.profile.firstname,
          lastname: this.profile.lastname,
          role: this.profile.role,
          student: this.profile.student,
          university: this.profile.student?.university,
          phone: this.profile.student?.phone,
          major: this.profile.student?.major
        })
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSubmitProfile() {
    const formValue = this.profileForm.value;

    const profileData: ProfileDTO = {
      id: this.profile.id,
      email: formValue.email,
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      role: this.profile.role,
      student: {
        id: this.profile.student?.id ?? 0,
        phone: formValue.phone,
        neptun: this.profile.student?.neptun ?? '',
        university: formValue.university,
        major: formValue.major,
      },
    }

    if(this.profileForm.valid) {
      this.userService.updateProfile(this.profile.id, profileData).subscribe({
        next: (msg) => {
          alert(msg);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  resetProfile() {
    this.profile = {
      id: 0,
      email: '',
      firstname: '',
      lastname: '',
      role: UserRole.STUDENT,
      student: undefined
    }
  }

  onSubmit() {}

  onFileSelected(name: any) {}
}
