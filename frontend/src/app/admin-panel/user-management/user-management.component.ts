import { Component, inject, OnInit } from '@angular/core';
import { UserDTO, UserRole } from '../../../types';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-management',
  imports: [RouterLink],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit{

  userService = inject(UserService);
  users: UserDTO[] = [];

  ngOnInit(): void {
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

  addUser() {}
}
