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
import { Company } from "./Company";
import { Practice } from "./Practice";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User, (user) => user.studentProfile)
  @JoinColumn()
  user: User;

  @Column()
  fullName: string;

  @Column()
  neptun: string;

  @Column()
  major: string;

  @Column()
  university: string;

  @OneToMany(() => Practice, (practice) => practice.student)
  practices: Practice[];
}
