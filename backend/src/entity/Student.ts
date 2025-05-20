import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Internship } from "./Internship";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  phone: number;

  @Column({ nullable: true })
  neptun: string;

  @Column({ nullable: true })
  major: string;

  @Column({ nullable: true })
  university: string;

  @OneToOne(() => User, (user) => user.student, { cascade: true })
  @JoinColumn()
  user: User;

  @OneToOne(() => Internship, (practice) => practice.student)
  internship: Internship;
}
