import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Feedback } from "./Feedback";
import { Document } from "./Document";
import { Student } from "./Student";
import { Mentor } from "./Mentor";
import { Company } from "./Company";

@Entity()
export class Practice {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Student, (student) => student.practices)
  student: Student;

  @ManyToOne(() => Mentor, (mentor) => mentor.practices)
  mentor: Mentor;

  @ManyToOne(() => Company, (company) => company.practices)
  company: Company;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: "int" })
  hoursRequired: number;

  @Column({ type: "int", default: 0 })
  hoursCompleted: number;
}
