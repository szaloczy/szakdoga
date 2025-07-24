import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InternshipDTO, MentorDTO, ProfileDTO, ProfileInternshipDTO, StudentDTO, UserRole } from '../../../types';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { InternshipService } from '../../services/internship.service';
import { I18nService } from '../../shared/i18n.pipe';
import { MentorService } from '../../services/mentor.service';

@Component({
  selector: 'app-student-profile',
  imports: [ReactiveFormsModule, I18nService],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss'
})
export class StudentProfileComponent implements OnInit{

  userService = inject(UserService);
  authService = inject(AuthService);
  mentorService = inject(MentorService);
  internshipService = inject(InternshipService);
  
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

  mentorProfile: MentorDTO = {
    id: 0,
    firstname: '',
    lastname: '',
    position: '',
    companyId: 0,
    internship: null,
    user: null
  }

  internship: ProfileInternshipDTO | null = null;

  ngOnInit(): void {
    const currentUserRole = this.authService.getRole();

    this.profileForm = this.fb.group({
      firstname: ['', []],
      lastname: ['', []],
      phone: ['', []],
      email: ['', []],
      university: ['', []],
      major: ['', []],
      neptun: ['', []]
    });

   this.loadStudentData();

   if(currentUserRole === "student") {
    this.loadIntershipData();
   }
  }

  loadStudentData() {
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
          major: this.profile.student?.major,
          neptun: this.profile.student?.neptun
        })
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadIntershipData() {
     this.internshipService.getByStudentId(this.authService.getUserId()).subscribe({
      next: (internshipData) => {
        this.internship = internshipData;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadMentorData() {
    this.mentorService.getOne(this.authService.getUserId()).subscribe({
      next: (mentorData) => {
        this.mentorProfile = mentorData;
        console.log(mentorData);
        
      },
      error: (err) => {
        console.error(err);
      }
    })
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
        neptun: formValue.neptun,
        university: formValue.university,
        major: formValue.major,
        user: null
      },
    }

    if(this.profileForm.valid) {
      this.userService.updateProfile(this.profile.id, profileData).subscribe({
        next: (msg) => {
          alert("User updeted successfully!");
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

  onSubmitCompanyForm() {}

  onFileSelected(name: any) {}
}
