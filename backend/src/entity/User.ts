import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  OneToOne,
} from "typeorm";
import { UserRole } from "../types";
import { Practice } from "./Practice";
import { Feedback } from "./Feedback";
import { Student } from "./Student";
import { Mentor } from "./Mentor";

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

  @Column({ type: "enum", enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @OneToOne(() => Student, (student) => student.user)
  studentProfile: Student;

  @OneToOne(() => Mentor, (mentor) => mentor.user)
  mentorProfile: Mentor;
}
