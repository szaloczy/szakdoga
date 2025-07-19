export enum UserRole {
  STUDENT = "student",
  MENTOR = "mentor",
  ADMIN = "admin",
}

export interface StudentDTO {
  phone: number;
  university: string;
  major: string;
  neptun: string;
}

export interface BaseUserDTO {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  active: boolean;
  role: UserRole;
}

export interface StudentDTO {
  id: number;
  phone: number | null;
  neptun: string;
  major: string;
  university: string;
}

export interface CompanyDTO {
  id: number;
  name: string;
  city: string;
  email: string;
  phone: string | null;
  address: string;
  active: boolean;
}

export interface MentorDTO {
  id: number;
  position: string;
  company: CompanyDTO;
}

export interface profileDTO {
  email: string;
  firstname: string;
  lastname: string;
  student: StudentDTO;
}

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

export interface profileInternshipDTO {
  id: number;
  startDate: string;
  endDate: string;
  isApproved: boolean;
  mentorName: string;
  companyName: string;
  mentorEmail: string;
  companyEmail: string;
  companyAddress: string;
  companyCity: string;
}
export interface StudentWithHoursDto {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  major?: string | null;
  university?: string | null;
  hours: number;
}
