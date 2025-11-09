export interface NestedI18n {
    [key: string]: NestedI18n | I18nItem;
}

export interface I18nItem {
    desc?: string;
    text: string;
}

export type Translations = Record<Language, Record<string, I18nItem | NestedI18n>>;

export enum Language {
    EN = 'en',
    HU = 'hu'
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AccessTokenDTO {
    accessToken: string;
}

export interface UserDTO {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    active: boolean;
    role: string;
    profilePicture?: string;
}

export type UserResponseDto = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  active: boolean;
  password: string;
  role: "admin" | "mentor" | "student";
  profilePicture?: string;
  mentor?: MentorDTO | null;
  student?: StudentDTO | null;
};


export interface RegisterDTO {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export interface StudentDTO {
    id: number;
    phone: number;
    neptun: string;
    major: string;
    university: string;
    user: UserDTO | null;
    internship?: {
        id: number;
        status: 'pending' | 'active' | 'completed' | 'cancelled';
        requiredWeeks: number;
        requiredHours: number;
        approvedHours: number;
        grade: number | null;
        finalizedAt: string | null;
        mentor: {
            id: number;
            name: string;
            email: string;
        } | null;
        company: {
            id: number;
            name: string;
        } | null;
    } | null;
}

export interface extendedStudentDTO {
    id: number;
    studentId: number;  // Student tábla ID-ja (internship-hez szükséges)
    firstname: string;
    lastname: string;
    email: string;
    hours: number;
    major: string | null;
    pendingHours: number;
    rejectedHours: number;
    totalSubmittedHours: number;
    university: string | null;
    profilePicture?: string;
    requiredHours?: number;
    internshipStatus?: 'active' | 'completed' | 'finalized' | 'pending' | 'cancelled';
    grade?: number | null;  // Véglegesítés során adott jegy (1-5)
    finalizedAt?: string | null;  // Véglegesítés időpontja
    internship?: {
        id: number;
        requiredWeeks: number;
        grade?: number;
        finalizedAt?: string;
    };
}

export interface ProfileDTO {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: UserRole;
    profilePicture?: string;
    student: StudentDTO | undefined;
}

export interface MentorDTO {
    id: number;
    firstname: string;
    lastname: string;
    position: string;
    companyId: number;
    internship: InternshipDTO | null;
    user: UserDTO | null;
}

export interface MentorProfileDTO {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    active: boolean;
    mentor: {
        id: number;
        position: string;
        company: CompanyDTO;
    };
}

export interface CreateMentorDTO {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    position: string;
    companyId: number;
    active: boolean;
    role: UserRole;
}

export interface UpdateMentorDTO {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    position?: string;
    companyId?: number;
    active?: boolean;
}

export interface CreateStudentDTO {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    active: boolean;
    role: UserRole;
}

export type InternshipStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface InternshipDTO {
    id: number;
    startDate: Date;
    endDate: Date;
    isApproved: boolean;
    requiredWeeks: number;
    status?: InternshipStatus;
    grade?: number;
    finalizedAt?: Date;
    student: StudentDTO;
    mentor: MentorDTO;
    company: CompanyDTO;
}

export interface InternshipListDTO {
    id: number;
    startDate: Date;
    endDate: Date;
    isApproved: boolean;
    requiredWeeks: number;
    status?: InternshipStatus;
    studentName: string;
    studentNeptun: string;
    mentorName: string;
    companyName: string;
}

export interface CreateInternshipDTO {
    student: number;
    mentor: number;
    company: number;
    startDate: string;
    endDate: string;
    isApproved: boolean;
    requiredWeeks: number;
    status?: InternshipStatus;
}

export interface ProfileInternshipDTO {
    id: number;
    startDate: string;
    endDate: string;
    isApproved: boolean;
    requiredWeeks: number;
    grade?: number;
    finalizedAt?: string;
    mentorName: string;
    companyName: string;
    mentorEmail: string;
    companyEmail: string;
    companyAddress: string;
    companyCity: string;
}

export interface CompanyDTO {
    id: number;
    name: string;
    city: string;
    email: string;
    phone: string;
    address: string;
    active: boolean;
    mentors: MentorDTO[];
    internships: InternshipDTO | null;
}

export interface DialogField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea';
    required?: boolean;
    options?: { value: string | boolean; label: string }[];
    placeholder?: string;
}

export interface InternshipHourDTO {
  id: number;
  date: string;         
  startTime: string;   
  endTime: string;     
  description: string;
  status: "pending" | "approved" | "rejected";
}

export interface CreateInternshipHourDTO {
    date: string;
    startTime: string; 
    endTime: string;   
    description: string;
    internshipId?: number; 
}

export interface InternshipWithHours {
    student: StudentDTO;
    hours: InternshipHourDTO[];
}

export interface Statistics {
    labels: string[];
    data: number[];
}

export interface ProgressStatistics {
    totalRequiredHours: number;
    completedHours: number;
    remainingHours: number;
    progressPercentage: number;
    completedWeeks: number;
    totalRequiredWeeks: number;
}

export interface DashboardProgress {
    labels: string[];
    data: number[];
    total: number;
    percentage: number;
    completed: number;
    remaining: number;
}

export enum UserRole {
    STUDENT = "student",
    ADMIN = "admin",
    MENTOR = "mentor",
}

export interface AdminStatistics {
    users: {
        total: number;
        students: number;
        mentors: number;
        admins: number;
    };
    internships: {
        total: number;
        approved: number;
        pending: number;
        completed: number;
    };
    hours: {
        total: number;
        approved: number;
        pending: number;
        rejected: number;
    };
    companies: {
        total: number;
        active: number;
    };
    documents: {
        total: number;
        approved: number;
        pending: number;
        rejected: number;
    };
}


export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface DocumentUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface Document {
name: any;
uploaderName: any;
  id: number;
  user: DocumentUser;
  filename: string;
  originalName: string;
  status: DocumentStatus;
  uploadedAt: string;
  reviewNote?: string;
}

export interface UploadedDocument {
  id: number;
  filename: string;
  originalName: string;
  uploadedAt: string;
  status: DocumentStatus;
  reviewNote?: string;
}
