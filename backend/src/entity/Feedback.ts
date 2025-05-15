import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Practice } from "./Practice";
import { User } from "./User";

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column({ type: "int", default: 0 })
  rating: number;

  @ManyToOne(() => Practice, (practice) => practice.feedbacks, {
    onDelete: "CASCADE",
  })
  practice: Practice;

  @ManyToOne(() => User, (user) => user.feedbacksGiven)
  mentor: User;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
