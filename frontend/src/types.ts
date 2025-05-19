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

export enum UserRole {
    STUDENT = "student",
    ADMIN = "admin",
    MENTOR = "mentor",
}