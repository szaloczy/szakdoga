import { AppDataSource } from "../data-source";
import { Student } from "../entity/Student";
import { Controller } from "./base.controller";

export class StudentController extends Controller {
  repository = AppDataSource.getRepository(Student);
}
