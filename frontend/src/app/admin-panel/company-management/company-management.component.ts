import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CompanyDTO } from '../../../types';
import { CompanyService } from '../../services/company.service';
import { EditDialogComponent } from '../../components/edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-company-management',
  imports: [
    EditDialogComponent
  ],
  templateUrl: './company-management.component.html',
  styleUrl: './company-management.component.scss'
})
export class CompanyManagementComponent {

  companyService = inject(CompanyService);
  companies: CompanyDTO[] = [];

  showDialog = false;

  companyDialogFields = [
  { name: 'name', label: 'Company name', type: 'text', required: true },
  { name: 'city', label: 'City', type: 'text', required: true },
  { name: 'address', label: 'Address', type: 'email', required: true },
  { name: 'mentor', label:'Mentorname', type: 'text', required: true},
  { name: 'intershipStudent?', label:'intershipStudent?', type: 'text', required: true},
];

  ngOnInit(): void {
    this.companyService.getAll().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  editCompany(company: CompanyDTO) {}

  deleteCompany(id: number) {}

  addCompany() {
    this.showDialog = !this.showDialog;
  }

  closeDialog() {
    this.showDialog = false;
  }
}
