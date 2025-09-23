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
}

export type UserResponseDto = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  active: boolean;
  password: string;
  role: "admin" | "mentor" | "student";
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
}

export interface extendedStudentDTO {
    id: number;
    firstname: string;
    lastname: string;
    hours: number;
    major: string;
    pendingHours: number;
    rejectedHours: number;
    totalSubmittedHours: number;
    university: string;
}

export interface ProfileDTO {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: UserRole;
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

export interface InternshipDTO {
    id: number;
    startDate: Date;
    endDate: Date;
    isApproved: boolean;
    student: StudentDTO;
    mentor: MentorDTO;
    company: CompanyDTO;
}

export interface InternshipListDTO {
    id: number;
    startDate: Date;
    endDate: Date;
    isApproved: boolean;
    studentName: string;
    studentNeptun: string;
    mentorName: string;
    companyName: string;
}

export interface ProfileInternshipDTO {
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

export enum UserRole {
    STUDENT = "student",
    ADMIN = "admin",
    MENTOR = "mentor",
}