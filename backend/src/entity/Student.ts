import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Internship } from "./Internship";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  neptun: string;

  @Column({ nullable: true })
  major: string;

  @Column({ nullable: true })
  university: string;

  @OneToOne(() => User, (user) => user.student, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @OneToOne(() => Internship, (practice) => practice.student)
  internship: Internship;
}
