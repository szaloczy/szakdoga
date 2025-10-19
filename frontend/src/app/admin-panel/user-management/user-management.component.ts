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
import { I18nService } from "../../shared/i18n.pipe";
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-user-management',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, I18nService],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  userService = inject(UserService);
  mentorService = inject(MentorService);
  companyService = inject(CompanyService);
  toastService = inject(ToastService);
  i18nService = inject(I18nService);
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
      next: () => {
        this.loadUsers();
        const successKey = this.isEditMode ? 'common_response.admin_panel.user.success_student_edit' : 'common_response.admin_panel.user.success_student_add';
        this.toastService.showSuccess(this.i18nService.transform(successKey));
      },
      error: (err) => {
        console.error(err);
        const errorKey = this.isEditMode ? 'common_response.admin_panel.user.error_student_edit' : 'common_response.admin_panel.user.error_student_add';
        this.toastService.showError(this.i18nService.transform(errorKey));
      },
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
      this.userService.update(this.editingUser.id, mentorData as any).subscribe({
        next: () => {
          this.loadUsers();
          this.showMentorForm = false;
          this.isEditMode = false;
          this.editingUser = null;
          this.toastService.showSuccess(this.i18nService.transform('common_response.admin_panel.user.success_mentor_edit'));
        },
        error: (err) => {
          console.error(err);
          this.toastService.showError(this.i18nService.transform('common_response.admin_panel.user.error_mentor_edit'));
        },
      });
    } else {
      this.mentorService.create(mentorData).subscribe({
        next: () => {
          this.loadUsers();
          this.showMentorForm = false;
          this.toastService.showSuccess(this.i18nService.transform('common_response.admin_panel.user.success_mentor_add'));
        },
        error: (err) => {
          console.error(err);
          this.toastService.showError(this.i18nService.transform('common_response.admin_panel.user.error_mentor_add'));
        },
      });
    }
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (users) => (this.users = users),
      error: (err) => {
        console.error(err);
        this.toastService.showError(this.i18nService.transform('common_response.admin_panel.user.error_while_loading'));
      },
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
      next: () => {
        this.loadUsers();
        this.toastService.showSuccess(this.i18nService.transform('common_response.admin_panel.user.success_delete'));
      },
      error: (err) => {
        console.error(err);
        this.toastService.showError(this.i18nService.transform('common_response.admin_panel.user.error_delete'));
      },
    });
  }
}
