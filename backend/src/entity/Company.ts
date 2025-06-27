import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Mentor } from "./Mentor";
import { Internship } from "./Internship";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  active: boolean;

  @OneToMany(() => Mentor, (mentor) => mentor.company)
  mentors: Mentor[];

  @OneToMany(() => Internship, (internship) => internship.company)
  internships: Internship[];
}
