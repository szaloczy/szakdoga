import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./Student";

@Entity()
export class Internship {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: "int" })
  hoursRequired: number;

  @Column({ type: "int", default: 0 })
  hoursCompleted: number;

  @ManyToOne(() => Student, (student) => student.practices)
  student: Student;
}
