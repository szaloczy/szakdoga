import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { AdminComponent } from './admin-panel/admin/admin.component';
import { UserManagementComponent } from './admin-panel/user-management/user-management.component';

export const routes: Routes = [
    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'admin', component: AdminComponent, canActivate: [() => inject(AuthService).adminAccess()],
    },
    { path: 'user-management', component: UserManagementComponent },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [() => inject(AuthService).preventGuestAccess()],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'profile', component: StudentProfileComponent },
            { path: '', redirectTo: 'dashboard', pathMatch:'full' }
        ]
    },
    {
        path: '**', redirectTo: '/login', pathMatch: 'full'
    }
];
