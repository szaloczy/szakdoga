import { Component, inject, OnInit } from '@angular/core';
import { InternshipDTO } from '../../../types';
import { InternshipService } from '../../services/internship.service';

@Component({
  selector: 'app-internship-management',
  imports: [],
  templateUrl: './internship-management.component.html',
  styleUrl: './internship-management.component.scss'
})
export class InternshipManagementComponent implements OnInit{

  internshipService = inject(InternshipService);

  internships: InternshipDTO[] = []

  ngOnInit(): void {
    this.loadInternships();
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

  addInternship() {}

  deleteInternship(id: number) {}

  editInternship(internship: InternshipDTO) {}
}
