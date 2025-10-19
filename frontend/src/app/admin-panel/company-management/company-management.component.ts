import { Component, inject } from '@angular/core';
import { CompanyDTO } from '../../../types';
import { CompanyService } from '../../services/company.service';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { I18nService } from '../../shared/i18n.pipe';

@Component({
  selector: 'app-company-management',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    I18nService
  ],
  templateUrl: './company-management.component.html',
  styleUrl: './company-management.component.scss'
})
export class CompanyManagementComponent {

  in18nService = inject(I18nService);
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
        this.loadCompanies();
        this.toastService.showSuccess(this.in18nService.transform("common_response.admin_panel.company.success_delete"));
      },
      error: (err) => {
        this.toastService.showError(this.in18nService.transform("common_response.admin_panel.company.error_delete"));
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
              this.loadCompanies();
              this.toastService.showSuccess(this.in18nService.transform("common_response.admin_panel.company.success_edit"));
            },
            error: (err) => {
              this.toastService.showError(this.in18nService.transform("common_response.admin_panel.company.error_edit"));
            }
          });
        } else {
          console.error("Editing company or its id is undefined.");
          this.toastService.showError(this.in18nService.transform("common_response.admin_panel.company.error_edit"));
        }
      } else {
        this.companyService.create(this.companyForm.value).subscribe({
          next: (response) => {
            this.toastService.showSuccess(this.in18nService.transform("common_response.admin_panel.company.success_add"));
            this.loadCompanies();
          },
          error: (err) => {
            this.toastService.showError(this.in18nService.transform("common_response.admin_panel.company.error_add"));
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
