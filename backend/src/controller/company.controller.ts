import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
import { Controller } from "./base.controller";

export class CompanyController extends Controller {
  repository = AppDataSource.getRepository(Company);
}
