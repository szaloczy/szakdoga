import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Internship } from "./Internship";

@Entity()
export class InternshipSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp" })
  startTime: Date;

  @Column({ type: "timestamp" })
  endTime: Date;

  @Column({ type: "text" })
  activityDescription: string;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(() => Internship, (internship) => internship.sessions, {
    onDelete: "CASCADE",
  })
  internship: Internship;
}
