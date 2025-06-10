import { Component, inject } from '@angular/core';
import { CompanyDTO } from '../../../types';
import { CompanyService } from '../../services/company.service';
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
  editingCompany: CompanyDTO | null = null;
  showCompanyForm = false;
  companyForm!: FormGroup;
  isEdit = false;
  companyId = 0;

  ngOnInit(): void {
    this.loadCompanies();

    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      active: [true, [Validators.required]],
    })
  }

  editCompany(company: CompanyDTO) {
   this.editingCompany = company;
   this.isEdit = true;
   this.showCompanyForm = true;

   this.companyForm.patchValue({
     name: company.name,
     city: company.city,
     email: company.email,
     phone: company.phone,
     address: company.address,
     active: company.active
    });
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

  toggleCompanyForm() {
    this.showCompanyForm = !this.showCompanyForm;
    this.isEdit = false;
  }

  saveCompany() {
    if(this.companyForm.valid) {
      if(this.isEdit) {
        if (this.editingCompany && this.editingCompany.id !== undefined) {
          this.companyService.update(this.editingCompany.id, this.companyForm.value).subscribe({
            next: (response) => {
              console.log("Company updated successfully: " + response);
              this.loadCompanies();
              this.toastService.showSuccess("Company updated successfully");
            },
            error: (err) => {
              console.error(err);
            }
          });
        } else {
          console.error("Editing company or its id is undefined.");
        }
      } else {
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
