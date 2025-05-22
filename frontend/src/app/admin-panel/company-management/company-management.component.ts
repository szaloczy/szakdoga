import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CompanyDTO, DialogField } from '../../../types';
import { CompanyService } from '../../services/company.service';
import { EditDialogComponent } from '../../components/edit-dialog/edit-dialog.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-company-management',
  imports: [
    EditDialogComponent,
    RouterLink
  ],
  templateUrl: './company-management.component.html',
  styleUrl: './company-management.component.scss'
})
export class CompanyManagementComponent {

  companyService = inject(CompanyService);
  companies: CompanyDTO[] = [];

  showDialog = false;

  fields: DialogField[] = [
    { name: 'name', label: 'Company Name', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
  ];

  formData: Record<string, any> = {
    name: '',
    city: '',
    address: '',
    mentorName: '',
    internshipStudent: 'yes'
  };

  ngOnInit(): void {
    this.loadCompanies();
  }

  editCompany(company: CompanyDTO) {}

  deleteCompany(id: number) {}

  addCompany() {
    this.showDialog = !this.showDialog;
  }

  closeDialog() {
    this.showDialog = false;
  }

  onDialogConfirmed(data: any) {
    this.companyService.create(data).subscribe({
      next: (msg) => {
        console.log("Company saved successfully: ", msg)
        this.loadCompanies();
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.showDialog = !this.showDialog;
  }

  loadCompanies() {
    this.companyService.getAll().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
