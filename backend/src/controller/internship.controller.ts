import { AppDataSource } from "../data-source";
import { Internship } from "../entity/Internship";
import { Controller } from "./base.controller";

export class InternshipController extends Controller {
  repository = AppDataSource.getRepository(Internship);

  getAll = async (req, res) => {
    const companies = await this.repository.find({
      relations: ["student", "mentor", "company"],
    });

    res.json(companies);
  };
}
