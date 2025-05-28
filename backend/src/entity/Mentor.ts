import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "./Company";
import { Internship } from "./Internship";
import { User } from "./User";

@Entity()
export class Mentor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: string;

  @OneToOne(() => User, (user) => user.mentor, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @OneToOne(() => Internship, (internship) => internship.mentor)
  internship: Internship;

  @ManyToOne(() => Company, (company) => company.mentors, {
    nullable: true,
  })
  company: Company;
}
