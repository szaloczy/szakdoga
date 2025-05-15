import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Feedback } from "./Feedback";
import { Document } from "./Document";

@Entity()
export class Practice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  hours: number;

  @ManyToOne(() => User, (user) => user.practices, { eager: true })
  student: User;

  @ManyToOne(() => User, { eager: true })
  mentor: User;

  @OneToMany(() => Document, (doc) => doc.practice, { cascade: true })
  documents: Document[];

  @OneToMany(() => Feedback, (feedback) => feedback.practice, { cascade: true })
  feedbacks: Feedback[];

  @Column({ default: false })
  approvedByAdmin: boolean;
}
