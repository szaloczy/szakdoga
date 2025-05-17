import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from "typeorm";
import { UserRole } from "../types";
import { Practice } from "./Practice";
import { Feedback } from "./Feedback";

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

  @OneToMany(() => Practice, (practice) => practice.student, { cascade: true })
  practices: Practice[];

  @OneToMany(() => Feedback, (feedback) => feedback.mentor)
  feedbacksGiven: Feedback[];
}
