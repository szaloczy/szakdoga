import { Repository } from "typeorm";
import { Controller } from "./base.controller";
import { AppDataSource } from "../data-source";

export class InternshipHour extends Controller {
  repository = AppDataSource.getRepository("InternshipHour");
}
