import { Component, inject, OnInit } from '@angular/core';
import { DialogField, UserDTO, UserRole } from '../../../types';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { EditDialogComponent } from '../../components/edit-dialog/edit-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  imports: [RouterLink, EditDialogComponent, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit{

  userService = inject(UserService);

  showStudentForm = false;
  showMentorForm = false;

  users: UserDTO[] = [];

  student = {
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  };

  mentor = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    companyId: '',
    active: true
  };

  companies = []; // feltöltés onInit-ban pl. backendről

  ngOnInit(): void {
    this.loadUsers();
  }

  toggleForm(role: 'student' | 'mentor') {
    this.showStudentForm = role === 'student';
    this.showMentorForm = role === 'mentor';
  }

  createStudent() {
    // Küldd be a student adatokat backendre
    console.log('Creating student:', this.student);
    // Reset + elrejtés
    this.student = { firstname: '', lastname: '', email: '', password: '' };
    this.showStudentForm = false;
  }

  createMentor() {
    // Küldd be a mentor adatokat backendre
    console.log('Creating mentor:', this.mentor);
    // Reset + elrejtés
    this.mentor = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      companyId: '',
      active: true
    };
    this.showMentorForm = false;
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

    deleteUser(id: number) {}
}
