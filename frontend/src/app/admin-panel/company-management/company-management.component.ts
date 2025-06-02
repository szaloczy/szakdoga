import { Component, inject } from '@angular/core';
import { CompanyDTO, DialogField } from '../../../types';
import { CompanyService } from '../../services/company.service';
import { EditDialogComponent } from '../../components/edit-dialog/edit-dialog.component';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-management',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './company-management.component.html',
  styleUrl: './company-management.component.scss'
})
export class CompanyManagementComponent {

  companyService = inject(CompanyService);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);


  companies: CompanyDTO[] = [];
  showCompanyForm = false;
  companyForm!: FormGroup;
  isEdit = false;
  companyId = 0;

  company: CompanyDTO = {
    id: 0,
    name: '',
    city: '',
    email: '',
    phone: '',
    address: '',
    active: true,
    mentors: [],
    internships: null
  }


  ngOnInit(): void {
    this.loadCompanies();

    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      active: ['true', [Validators.required]],
    })
  }

  editCompany(company: CompanyDTO) {
   
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
    if(this.companyForm.valid) {
    this.companyService.create(this.companyForm.value).subscribe({
      next: (response) => {
        console.log("Company created suceesully: " + response);
        this.loadCompanies();
      },
      error: (err) => {
        console.error(err);
      }
    });
    }

    this.showCompanyForm = !this.showCompanyForm;
    this.companyForm.reset();
  }

  closeDialog() {
    this.showCompanyForm = false;
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
