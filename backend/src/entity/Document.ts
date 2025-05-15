import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Practice } from "./Practice";

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column()
  uploadDate: Date;

  @ManyToOne(() => Practice, (practice) => practice.documents, {
    onDelete: "CASCADE",
  })
  practice: Practice;
}
