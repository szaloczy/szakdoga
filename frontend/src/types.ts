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
    internship: InternshipDTO;
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

export interface CompanyDTO {
    id: number;
    name: string;
    city: string;
    address: string;
    mentors: MentorDTO[];
    internships: InternshipDTO;
}

export enum UserRole {
    STUDENT = "student",
    ADMIN = "admin",
    MENTOR = "mentor",
}