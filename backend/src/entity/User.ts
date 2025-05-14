import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import { UserRole } from "../types";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;
}
