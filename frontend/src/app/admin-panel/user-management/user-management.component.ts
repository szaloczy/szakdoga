import { Component, inject, OnInit } from '@angular/core';
import { CompanyDTO, DialogField, UserDTO, UserRole } from '../../../types';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-user-management',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit{

  userService = inject(UserService);
  companyService = inject(CompanyService);
  fb = inject(FormBuilder);

  showStudentForm = false;
  showMentorForm = false;

  users: UserDTO[] = [];
  companies: CompanyDTO[] = [];
  studentForm!: FormGroup;
  mentorForm!: FormGroup;

  student = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    active: true,
  };

  mentor = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    position: '',
    companyId: '',
    active: true
  };

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      active: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.mentorForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      position: ['', Validators.required],
      active: ['', [Validators.required]],
      company: ['', [Validators.required]]
    });

    this.loadUsers();
    this.companyService.getAll().subscribe( companies => { this.companies = companies });
  }

  toggleForm(role: 'student' | 'mentor') {
    this.showStudentForm = role === 'student';
    this.showMentorForm = role === 'mentor';
  }

  createStudent() {

    const studentData = {
      ...this.studentForm.value,
      role: UserRole.STUDENT
    }

    this.userService.create(studentData).subscribe({
      next: (res) => {
        console.log(res);
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.student = { firstname: '', lastname: '', email: '', password: '', active: true };
    this.showStudentForm = false;
    this.studentForm.reset();
  }

  createMentor() {
    const mentorData = {
      ...this.mentorForm.value,
      role: UserRole.MENTOR
    }

    this.userService.create(mentorData).subscribe({
      next: (response) => {
        console.log("Mentor created sucessfully: " + response);
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.mentor = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      position: '',
      companyId: '',
      active: true
    };
    this.showMentorForm = false;
    this.mentorForm.reset();
  }

    loadUsers() {
      this.userService.getAll().subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (err) => {
          console.error(err);
        }
      })
    }

    editUser(user: UserDTO) {}

    deleteUser(id: number) {
      this.userService.delete(id).subscribe({
        next: () => {
          console.log("Deleted successfully");
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
}
