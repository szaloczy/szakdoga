export enum UserRole {
  STUDENT = "student",
  MENTOR = "mentor",
  ADMIN = "admin",
}

export interface User {
  id: number | null;
  email: string;
  firstname: string;
  lastname: string;
  active: boolean;
  role: UserRole;
}

export interface StudentDTO {
  id?: number;
  phone: string | null;
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

export interface createMentorDTO {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  position: string;
  companyId: number;
  active: boolean;
}


/* 
============================================New DTOs=============================================
*/ 

export interface UpdateProfileDTO {
  email?: string;
  firstname?: string;
  lastname?: string;
  student?: {
    phone?: string;
    major?: string;
    university?: string;
    neptun?: string;
  };
}

export interface GetProfileResponseDTO {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  active: boolean;
  student?: StudentDTO;
  mentor?: MentorDTO;
}