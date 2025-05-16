import { AppDataSource } from "../data-source";
import { Practice } from "../entity/Practice";
import { Controller } from "./base.controller";

export class PracticeController extends Controller {
  repository = AppDataSource.getRepository(Practice);
}
