import { Component, inject } from '@angular/core';
import { MentorService } from '../../services/mentor.service';
import { InternshipWithHours } from '../../../types';

@Component({
  selector: 'app-student-list',
  imports: [],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {

  mentorService = inject(MentorService);

  students: InternshipWithHours[] = [];

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.mentorService.getStudents().subscribe((students) => {
      this.students = students;
    });
  }

  viewStudent() {
    //this.router.navigate(['/mentor/students', studentId]);
  }
}
