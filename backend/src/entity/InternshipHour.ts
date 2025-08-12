import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Internship } from "./Internship";
import { Mentor } from "./Mentor";

@Entity()
export class InternshipHour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  description: string;

  @Column({ default: "pending" })
  status: "pending" | "approved" | "rejected";

  @ManyToOne(() => Internship, (internship) => internship.hours, {
    onDelete: "CASCADE",
  })
  internship: Internship;

  @ManyToOne(() => Mentor, { nullable: true, eager: true })
  approvedBy: Mentor;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  rejectionReason?: string;
}
