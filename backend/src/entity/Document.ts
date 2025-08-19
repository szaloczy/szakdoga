import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  user: User;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column({ default: "pending" })
  status: "pending" | "approved" | "rejected";

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ nullable: true })
  reviewNote?: string;
}
