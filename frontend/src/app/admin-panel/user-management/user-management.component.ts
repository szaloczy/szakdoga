import { Component, inject, OnInit } from '@angular/core';
import { DialogField, UserDTO, UserRole } from '../../../types';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { EditDialogComponent } from '../../components/edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-user-management',
  imports: [RouterLink, EditDialogComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit{

  userService = inject(UserService);
  users: UserDTO[] = [];
  showDialog = false;
  showEditDialog = false;
  roles = [{}, {}];
  userId = 0;

  fields: DialogField[] = [
    { name: 'firstname', label: 'Firstname', type: 'text', required: true },
    { name: 'lastname', label: 'Lastname', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'password', label: 'Password', type: 'text' },
    { name: 'active', label: 'Active', type: 'select', options: [
      {label: 'Active', value: true},
      {label: 'Inactive', value: false}
    ] },
    { name: 'role', label: 'Role', type: 'select', placeholder:'Role', options: [
      {label: 'Student', value: UserRole.STUDENT},
      {label: 'Mentor', value: UserRole.MENTOR},
      {label: 'Admin', value: UserRole.ADMIN}
    ] },
  ];

  editUserFields: DialogField[] = [
  { name: 'email', label: 'Email', type: 'text', placeholder: 'Email' },
  { name: 'firstname', label: 'firstname', type: 'text', placeholder: 'Firstname' },
  { name: 'lastname', label: 'lastname', type: 'text', placeholder: 'Lastname' },
  { name: 'active', label: 'Active', type: 'select', options: [
      {label: 'Active', value: true},
      {label: 'Inactive', value: false}
    ] },
  { name: 'role', label: 'Role', type: 'select', placeholder:'Role', options: [
      {label: 'Student', value: UserRole.STUDENT},
      {label: 'Mentor', value: UserRole.MENTOR},
      {label: 'Admin', value: UserRole.ADMIN}
    ] },
  ];

  formData: Record<string, any> = {
    firstname: '',
    lastname: '',
    email: '',
    password:'',
    role: '',
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  editUser(user: UserDTO) {
    this.showEditDialog = !this.showEditDialog;
    this.formData = user;
    this.userId = user.id;
  }

  deleteUser(id: number) {
    this.userService.delete(id).subscribe({
      next: (response) => {
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  addUser() {
    this.showDialog = !this.showDialog;
  }

  closeDialog() {
    this.showDialog = false;
  }

  onCreateDialogConfirmed(data: any) {
    this.userService.create(data).subscribe({
      next: (msg) => {
        console.log("User saved successfully: ", msg)
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.showDialog = !this.showDialog;
  }

  onEditDialogConfirmed(data: any) {
    this.userService.update(this.userId, data).subscribe({
      next: (msg) => {
        console.log("User saved successfully: ", msg)
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.showEditDialog = !this.showEditDialog;
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
}
