import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Practice } from "./Practice";
import { Mentor } from "./Mentor";

@Entity()
export class Company {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  contactName: string;

  @Column()
  contactEmail: string;

  @Column()
  contactPhone: string;

  @Column({
    type: "enum",
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  })
  status: "pending" | "approved" | "rejected";

  // Egy céghez több gyakorlati idő is tartozhat (különböző hallgatók)
  @OneToMany(() => Practice, (practice) => practice.company)
  practices: Practice[];

  // Egy céghez több mentor is tartozhat
  @OneToMany(() => Mentor, (mentor) => mentor.company)
  mentors: Mentor[];
}
