export enum UserRole {
  STUDENT = "student",
  MENTOR = "mentor",
  ADMIN = "admin",
}

export interface StudentDTO {
  phone: number;
  university: string;
  major: string;
  neputun: string;
}

export interface profileDTO {
  email: string;
  firstname: string;
  lastname: string;
  student: StudentDTO;
}

// src/types/internship.dto.ts

export interface InternshipDTO {
  id: number;
  startDate: string;
  endDate: string;
  isApproved: boolean;
  studentName: string;
  studentNeptun: string | null;
  mentorName: string;
  companyName: string;
}
