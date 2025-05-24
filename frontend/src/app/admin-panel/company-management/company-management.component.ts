import { Component, inject } from '@angular/core';
import { CompanyDTO, DialogField } from '../../../types';
import { CompanyService } from '../../services/company.service';
import { EditDialogComponent } from '../../components/edit-dialog/edit-dialog.component';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

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
  toastService = inject(ToastService);
  companies: CompanyDTO[] = [];
  showDialog = false;
  isEdit = false;
  companyId = 0;

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

  editCompany(company: CompanyDTO) {
    this.showDialog = !this.showDialog;
    this.formData = company;
    this.companyId = company.id;
    this.isEdit = true;
  }

  deleteCompany(id: number) {
    this.companyService.delete(id).subscribe({
      next: (response) => {
        console.log("Company deleted sucessfully");
        this.loadCompanies();
        this.toastService.showSuccess("Company deleted sucessfully");
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  addCompany() {
    this.showDialog = !this.showDialog;
  }

  closeDialog() {
    this.showDialog = false;
  }

  onDialogConfirmed(data: any) {
    if(this.isEdit) {
      this.companyService.update(this.companyId, data).subscribe({
      next: (response) => {
        console.log("Company updated succefully");
      },
      error: (err) => {
        console.log(err);
      }
    });
    } else {
      this.companyService.create(data).subscribe({
      next: (msg) => {
        console.log("Company saved successfully: ", msg)
      },
      error: (err) => {
        console.error(err);
      }
    });
    }
    this.loadCompanies();
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
