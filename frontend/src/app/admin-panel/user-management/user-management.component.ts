import { Component, inject, OnInit } from '@angular/core';
import {
  CompanyDTO,
  UserResponseDto,
  UserRole,
  CreateMentorDTO,
  CreateStudentDTO,
} from '../../../types';
import { UserService } from '../../services/user.service';
import { MentorService } from '../../services/mentor.service';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  userService = inject(UserService);
  mentorService = inject(MentorService);
  companyService = inject(CompanyService);
  fb = inject(FormBuilder);

  showStudentForm = false;
  showMentorForm = false;

  users: UserResponseDto[] = [];
  companies: CompanyDTO[] = [];
  studentForm!: FormGroup;
  mentorForm!: FormGroup;

  editingUser: UserResponseDto | null = null;
  isEditMode = false;

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      active: [true, Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.mentorForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      position: ['', Validators.required],
      active: [true, [Validators.required]],
      companyId: ['',[Validators.required]],
    });

    this.loadUsers();
    this.companyService.getAll().subscribe((companies) => {
      this.companies = companies;
    });
  }

  toggleForm(role: 'student' | 'mentor') {
    this.showStudentForm = role === 'student';
    this.showMentorForm = role === 'mentor';
  }

  startCreateStudent() {
    this.studentForm.reset({ active: true });
    this.isEditMode = false;
    this.editingUser = null;
    this.toggleForm('student');
  }

startCreateMentor() {
    this.mentorForm.reset({ active: true, companyId: '' });
    this.isEditMode = false;
    this.editingUser = null;
    this.toggleForm('mentor');
  }

  createStudent() {
    const studentData: CreateStudentDTO = {
      ...this.studentForm.value,
      role: UserRole.STUDENT,
    };

    const action$ = this.isEditMode && this.editingUser
      ? this.userService.update(this.editingUser.id, studentData as any)
      : this.userService.create(studentData);

    action$.subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error(err),
    });

    this.showStudentForm = false;
    this.studentForm.reset();
    this.isEditMode = false;
    this.editingUser = null;
  }

  createMentor() {
    const mentorData: CreateMentorDTO = {
      ...this.mentorForm.value,
      role: UserRole.MENTOR,
    };

    if(this.isEditMode && this.editingUser) {
      // Update existing mentor
      this.userService.update(this.editingUser.id, mentorData as any).subscribe({
        next: () => {
          this.loadUsers();
          this.showMentorForm = false;
          this.isEditMode = false;
          this.editingUser = null;
        },
        error: (err) => console.error(err),
      });
    } else {
      // Create new mentor
      this.mentorService.create(mentorData).subscribe({
        next: () => {
          this.loadUsers();
          this.showMentorForm = false;
        },
        error: (err) => console.error(err),
      });
    }
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (users) => (this.users = users),
      error: (err) => console.error(err),
    });
  }

  editUser(user: UserResponseDto) {
    this.editingUser = user;
    this.isEditMode = true;

    if (user.role === UserRole.STUDENT) {
      this.toggleForm('student');
      this.studentForm.patchValue({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: '',
        active: user.active,
      });
    } else if (user.role === UserRole.MENTOR) {
      this.toggleForm('mentor');
      this.mentorForm.patchValue({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: '',
        position: user.mentor?.position ?? '',
        active: user.active,
        companyId: user.mentor?.companyId ?? '',
      });
    }
  }

  deleteUser(id: number) {
    this.userService.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error(err),
    });
  }
}
