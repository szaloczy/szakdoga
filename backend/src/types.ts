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
  user?: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: UserRole;
    active: boolean;
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
  user?: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: UserRole;
    active: boolean;
  };
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
  hours: number;                    // Jóváhagyott órák összesen
  pendingHours: number;             // Jóváhagyásra váró órák
  rejectedHours: number;            // Elutasított órák
  totalSubmittedHours: number;      // Összes beküldött óra
}

export interface ApproveAllHoursResponse {
  success: boolean;
  message: string;
  approvedHours: number;
  newTotalHours: number;
}

export interface StudentHourDetailsResponse {
  studentId: number;
  statistics: {
    totalHours: number;
    approvedHours: number;
    pendingHours: number;
    rejectedHours: number;
  };
  hours: HourEntryDTO[];
}

export interface HourEntryDTO {
  id: number;
  date: string;                     // ISO date string
  hours: number;                    // Órák száma (pl. 8, 4.5)
  description: string;              // Munka leírása
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;              // ISO datetime
  reviewedAt?: string;              // ISO datetime (ha reviewed)
  reviewedBy?: string;              // Mentor email/név
  rejectionReason?: string;         // Ha rejected
}

export interface BulkApproveResponse {
  success: boolean;
  processedCount: number;
  errors: string[];
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
  id?: number; // User ID
  email?: string;
  firstname?: string;
  lastname?: string;
  student?: {
    id?: number; // Student ID
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