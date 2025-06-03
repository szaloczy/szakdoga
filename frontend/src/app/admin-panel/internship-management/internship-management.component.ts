import { Component, inject, OnInit } from '@angular/core';
import { CompanyDTO, InternshipDTO, InternshipListDTO, MentorDTO, StudentDTO } from '../../../types';
import { InternshipService } from '../../services/internship.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { CompanyService } from '../../services/company.service';
import { MentorService } from '../../services/mentor.service';

@Component({
  selector: 'app-internship-management',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './internship-management.component.html',
  styleUrl: './internship-management.component.scss'
})
export class InternshipManagementComponent implements OnInit{

  internshipService = inject(InternshipService);
  studentService = inject(StudentService);
  companyService = inject(CompanyService);
  mentorService = inject(MentorService);
  fb = inject(FormBuilder);

  internships: InternshipListDTO[] = []
  students: StudentDTO[] = [];
  companies: CompanyDTO[] = [];
  mentors: MentorDTO[] = [];

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
      isApproved: ['true', [Validators.required]],
    });
  }

  loadInternships() {
    this.internshipService.getAll().subscribe({
      next: (interships) => {
        this.internships = interships;
      },
      error: (err) => {
        console.error(err);
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
    this.showInternshipForm = !this.showInternshipForm;
  }

  createInternship() {
    this.internshipService.create(this.internshipForm.value).subscribe({
      next: (response) => {
        console.log("Internship created successfully: ", response);
        this.loadInternships();
        this.showInternshipForm = false;
        this.internshipForm.reset();
      },
      error: (err) => {
        console.error("Error creating internship: ", err);
      },
    });
  }

  deleteInternship(id: number) {
    this.internshipService.delete(id).subscribe({
      next: (response) => {
        console.log("intrnship deleted sucessfully: " + response);
        this.loadInternships();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  editInternship(internship: InternshipListDTO) {}
}
