import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Mentor } from "./Mentor";
import { Internship } from "./Internship";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @OneToMany(() => Mentor, (mentor) => mentor.company)
  mentors: Mentor[];

  @OneToMany(() => Internship, (internship) => internship.company)
  internships: Internship[];
}
