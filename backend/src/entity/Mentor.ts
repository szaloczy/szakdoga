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
export class Mentor {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User, (user) => user.mentorProfile)
  @JoinColumn()
  user: User;

  @Column()
  fullName: string;

  @ManyToOne(() => Company, (company) => company.mentors)
  company: Company;

  @OneToMany(() => Practice, (practice) => practice.mentor)
  practices: Practice[];
}
