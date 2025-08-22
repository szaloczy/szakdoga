import { Component, inject } from '@angular/core';
import { MentorService } from '../../services/mentor.service';
import { InternshipWithHours, extendedStudentDTO } from '../../../types';

@Component({
  selector: 'app-student-list',
  imports: [],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {

  mentorService = inject(MentorService);

  students: extendedStudentDTO[] = [];

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
