import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Practice } from "./entity/Practice";
import { Feedback } from "./entity/Feedback";
import { Document } from "./entity/Document";
import { Student } from "./entity/Student";
import { Company } from "./entity/Company";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "internship_management",
  synchronize: true,
  logging: false,
  entities: [User, Practice, Feedback, Document, Student, Company],
  migrations: [],
  subscribers: [],
});
