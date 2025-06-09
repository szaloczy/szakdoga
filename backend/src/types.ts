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

export interface CreateStudentUserDto {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: "student";
  student: {
    phone?: string;
    neptun: string;
    major: string;
    university: string;
  };
}

export interface CreateMentorUserDto {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: "mentor";
  mentor: {
    position: string;
    companyId: number;
  };
}

export interface UpdateUserDto {
  email?: string;
  firstname?: string;
  lastname?: string;
  active?: boolean;

  student?: {
    phone?: string | null;
    major?: string;
    university?: string;
  };

  mentor?: {
    position?: string;
    companyId?: number;
  };
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

export interface UserResponseDTO extends BaseUserDTO {
  student?: StudentDTO;
  mentor?: MentorDTO;
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
