import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { UserRole } from "../types";
import { Internship } from "./Internship";
import { Student } from "./Student";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: "enum", enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @OneToOne(() => Student, (student) => student.user)
  student: Student;
}
