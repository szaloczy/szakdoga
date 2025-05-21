import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Student } from "./Student";
import { Company } from "./Company";
import { Mentor } from "./Mentor";

@Entity()
export class Internship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @Column({ default: false })
  isApproved: boolean;

  @OneToOne(() => Student, (student) => student.internship)
  student: Student;

  @OneToOne(() => Mentor, (mentor) => mentor.internship)
  mentor: Mentor;

  @ManyToOne(() => Company, (company) => company.internships, {
    onDelete: "SET NULL",
  })
  company: Company;
}
