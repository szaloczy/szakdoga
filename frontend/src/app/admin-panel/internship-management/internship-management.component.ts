import { Component, inject, OnInit } from '@angular/core';
import { CompanyDTO, InternshipListDTO, MentorDTO, StudentDTO, CreateInternshipDTO } from '../../../types';
import { InternshipService } from '../../services/internship.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { CompanyService } from '../../services/company.service';
import { MentorService } from '../../services/mentor.service';
import { I18nService } from '../../shared/i18n.pipe';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-internship-management',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    I18nService
  ],
  templateUrl: './internship-management.component.html',
  styleUrl: './internship-management.component.scss'
})
export class InternshipManagementComponent implements OnInit{

  internshipService = inject(InternshipService);
  studentService = inject(StudentService);
  companyService = inject(CompanyService);
  mentorService = inject(MentorService);
  i18nService = inject(I18nService);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);

  internships: InternshipListDTO[] = []
  students: StudentDTO[] = [];
  companies: CompanyDTO[] = [];
  mentors: MentorDTO[] = [];
  editingInternship: InternshipListDTO | null = null;
  isEdit = false;

  showInternshipForm = false;
  internshipForm!: FormGroup;

  ngOnInit(): void {
    this.loadStudents();
    this.loadMentors();
    this.loadCompanies();
    this.loadInternships();
    this.internshipForm = this.fb.group({
      student: ['', [Validators.required]],
      mentor: ['', [Validators.required]],
      company: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      isApproved: [true, [Validators.required]],
      requiredWeeks: [6, [Validators.required, Validators.min(1)]],
    });
  }

  loadInternships() {
    this.internshipService.getAll().subscribe({
      next: (interships) => {
        this.internships = interships;
      },
      error: (err) => {
        this.toastService.showError(this.i18nService.transform("common_response.admin_panel.internship.error_while_loading"));
      }
    })
  }

  loadStudents() {
    this.studentService.getAll().subscribe((students) => this.students = students);
  }

  loadCompanies() {
    this.companyService.getAll().subscribe((companies) => this.companies = companies);
  }

  loadMentors() {
    this.mentorService.getAll().subscribe((mentors) => this.mentors = mentors);
  }

  addInternship() {
    this.isEdit = false;
    this.showInternshipForm = !this.showInternshipForm;
  }

  saveInternship() {
    if(this.isEdit) {
      if (this.editingInternship && this.editingInternship.id !== undefined) {
        this.internshipService.update(this.editingInternship.id, this.internshipForm.value).subscribe({
          next: (response) => {
            this.toastService.showSuccess(this.i18nService.transform("common_response.admin_panel.internship.success_edit"));
            this.loadInternships();
            this.showInternshipForm = false;
            this.internshipForm.reset();
            this.isEdit = false;
          },
          error: (err) => {
            this.toastService.showError(this.i18nService.transform("common_response.admin_panel.internship.error_edit"));
          },
        });
      } else {
        this.toastService.showError("No internship selected for editing or missing id.");
      }
    } else {
      this.internshipService.create(this.internshipForm.value).subscribe({
        next: (response) => {
          this.toastService.showSuccess(this.i18nService.transform("common_response.admin_panel.internship.success_add"));
          this.loadInternships();
          this.showInternshipForm = false;
          this.internshipForm.reset();
        },
        error: (err) => {
          this.toastService.showError(this.i18nService.transform("common_response.admin_panel.internship.error_add"));
        },
      });
    }
  }

  deleteInternship(id: number) {
    this.internshipService.delete(id).subscribe({
      next: (response) => {
        this.toastService.showSuccess(this.i18nService.transform("common_response.admin_panel.internship.success_delete"));
        this.loadInternships();
      },
      error: (err) => {
        this.toastService.showError(this.i18nService.transform("common_response.admin_panel.internship.error_delete"));
      }
    })
  }

  editInternship(internship: InternshipListDTO) {
    this.isEdit = true;
    this.showInternshipForm = true;
    this.editingInternship = internship;
    
    const student = this.students.find(s => 
      s.user?.firstname + ' ' + s.user?.lastname === internship.studentName
    );
    
    const mentor = this.mentors.find(m => 
      m.user?.firstname + ' ' + m.user?.lastname === internship.mentorName
    );
    
    const company = this.companies.find(c => c.name === internship.companyName);

    this.internshipForm.patchValue({
      student: student?.id || '',
      mentor: mentor?.id || '',
      company: company?.id || '',
      startDate: internship.startDate,
      endDate: internship.endDate,
      isApproved: internship.isApproved,
      requiredWeeks: internship.requiredWeeks || 6
    });
  }
}
