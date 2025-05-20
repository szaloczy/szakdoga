import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "./Company";
import { Internship } from "./Internship";

@Entity()
export class Mentor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  position: string;

  @OneToOne(() => Internship, (internship) => internship.mentor)
  internship: Internship;

  @ManyToOne(() => Company, (company) => company.mentors)
  company: Company;
}
