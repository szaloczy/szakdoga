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
import { CompanyManagementComponent } from './admin-panel/company-management/company-management.component';
import { InternshipManagementComponent } from './admin-panel/internship-management/internship-management.component';
import { InternshipHoursComponent } from './pages/internship-hours/internship-hours.component';

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
    { 
        path: 'users', component: UserManagementComponent, canActivate: [() => inject(AuthService).adminAccess()],
    },
    {
        path: 'companies', component: CompanyManagementComponent, canActivate: [() => inject(AuthService).adminAccess()],
    },
    {
        path: 'internships', component: InternshipManagementComponent, canActivate: [() => inject(AuthService).adminAccess()]
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [() => inject(AuthService).preventGuestAccess()],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'profile', component: StudentProfileComponent },
            { path: 'internship-hours', component: InternshipHoursComponent },
            { path: '', redirectTo: 'dashboard', pathMatch:'full' },
        ]
    },
    {
        path: '**', redirectTo: '/login', pathMatch: 'full'
    }
];
