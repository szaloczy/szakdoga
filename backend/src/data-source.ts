import "reflect-metadata";
import { dbHost } from "./config";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Internship } from "./entity/Internship";
import { Student } from "./entity/Student";
import { Company } from "./entity/Company";
import { Mentor } from "./entity/Mentor";
import { InternshipHour } from "./entity/InternshipHour";
import { Document } from "./entity/Document";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbHost,
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "internship_management",
  synchronize: true,
  logging: false,
  entities: [User, Internship, Student, Company, Mentor, InternshipHour, Document],
  migrations: [],
  subscribers: [],
});
