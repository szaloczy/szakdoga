import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentListComponent } from './student-list.component';
import { MentorService } from '../../services/mentor.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { extendedStudentDTO } from '../../../types';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let mentorService: jasmine.SpyObj<MentorService>;

  const mockStudents: extendedStudentDTO[] = [
    {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      profilePicture: undefined,
      hours: 120,
      major: 'Computer Science',
      pendingHours: 15,
      rejectedHours: 5,
      totalSubmittedHours: 140,
      university: 'Test University'
    },
    {
      id: 2,
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'jane.smith@example.com',
      profilePicture: undefined,
      hours: 80,
      major: 'Engineering',
      pendingHours: 10,
      rejectedHours: 0,
      totalSubmittedHours: 90,
      university: 'Test University'
    }
  ];

  beforeEach(async () => {
    const mentorServiceSpy = jasmine.createSpyObj('MentorService', ['getStudents']);

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MentorService, useValue: mentorServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    mentorService = TestBed.inject(MentorService) as jasmine.SpyObj<MentorService>;

    mentorService.getStudents.and.returnValue(of(mockStudents));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on init', () => {
    fixture.detectChanges(); // This calls ngOnInit

    expect(mentorService.getStudents).toHaveBeenCalled();
    expect(component.students).toEqual(mockStudents);
    expect(component.students.length).toBe(2);
  });

  it('should handle students loading error', () => {
    mentorService.getStudents.and.returnValue(throwError(() => new Error('Loading failed')));
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(component.students).toEqual([]);
  });

  it('should call loadStudents method', () => {
    spyOn(component, 'loadStudents').and.callThrough();
    
    fixture.detectChanges();

    expect(component.loadStudents).toHaveBeenCalled();
  });

  it('should initialize with empty students array', () => {
    expect(component.students).toEqual([]);
  });

  it('should have viewStudent method', () => {
    expect(component.viewStudent).toBeDefined();
    expect(typeof component.viewStudent).toBe('function');
  });

  it('should call viewStudent without errors', () => {
    expect(() => component.viewStudent()).not.toThrow();
  });

  it('should update students array when loadStudents is called', () => {
    component.loadStudents();

    expect(component.students).toEqual(mockStudents);
    expect(component.students[0].firstname).toBe('John');
    expect(component.students[1].firstname).toBe('Jane');
  });

  it('should display student information correctly', () => {
    component.students = mockStudents;
    
    expect(component.students[0].hours).toBe(120);
    expect(component.students[0].major).toBe('Computer Science');
    expect(component.students[1].hours).toBe(80);
    expect(component.students[1].major).toBe('Engineering');
  });
});
