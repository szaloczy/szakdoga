import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Student } from "./Student";
import { Company } from "./Company";
import { Mentor } from "./Mentor";
import { InternshipSession } from "./InternshipSession";

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

  @OneToOne(() => Student, (student) => student.internship, {
    onDelete: "CASCADE",
    cascade: false,
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  student: Student;

  @OneToOne(() => Mentor, (mentor) => mentor.internship, {
    onDelete: "SET NULL",
    cascade: false,
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  mentor: Mentor;

  @ManyToOne(() => Company, (company) => company.internships, {
    onDelete: "SET NULL",
  })
  company: Company;

  @OneToMany(() => InternshipSession, (session) => session.internship, {
    cascade: true,
  })
  sessions: InternshipSession[];
}
