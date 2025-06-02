import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
import { Controller } from "./base.controller";

export class CompanyController extends Controller {
  repository = AppDataSource.getRepository(Company);

  getAll = async (req, res) => {
    const companies = await this.repository.find({
      relations: ["mentors", "mentors.user"],
    });

    res.json(companies);
  };
}
