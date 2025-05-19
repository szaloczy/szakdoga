import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Internship } from "./entity/Internship";
import { Student } from "./entity/Student";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "internship_management",
  synchronize: true,
  logging: false,
  entities: [User, Internship, Student],
  migrations: [],
  subscribers: [],
});
